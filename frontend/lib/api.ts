import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores/auth";

export type { components, paths, operations } from "./api-types";
export type PathResponse<T extends keyof import("./api-types").paths> =
  import("./api-types").paths[T] extends { get: { responses: any } }
    ? import("./api-types").paths[T]["get"]["responses"]
    : never;

export const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api" });

let refreshing: Promise<string> | null = null;

// Rate limit retry state
const retryState = new WeakMap<any, { attempt: number; lastRetryAt: number }>();
type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retried?: boolean;
  _serviceRetried?: boolean;
};

/**
 * Calculate exponential backoff delay for rate-limited requests
 * @param attempt Retry attempt number (0-indexed)
 * @returns Delay in milliseconds
 */
function getRetryDelay(attempt: number): number {
  // Exponential backoff: 1s, 2s, 4s, 8s, 16s (max 5 attempts)
  const baseDelay = 1000;
  const maxDelay = 16000;
  const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
  // Add jitter to prevent thundering herd
  const jitter = Math.random() * 0.3 * delay;
  return delay + jitter;
}

/**
 * Extract Retry-After header value in milliseconds
 * @param retryAfter Header value (seconds or HTTP date)
 * @returns Delay in milliseconds, or null if invalid
 */
function parseRetryAfter(retryAfter: string | undefined): number | null {
  if (!retryAfter) return null;
  
  // Try parsing as seconds
  const seconds = parseInt(retryAfter, 10);
  if (!isNaN(seconds)) return seconds * 1000;
  
  // Try parsing as HTTP date
  const date = new Date(retryAfter);
  if (!isNaN(date.getTime())) {
    const delay = date.getTime() - Date.now();
    return delay > 0 ? delay : null;
  }
  
  return null;
}

api.interceptors.request.use(config => {
  const token = useAuthStore.getState().access;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableRequestConfig | undefined;
    if (!original) return Promise.reject(error);

    const auth = useAuthStore.getState();

    // Handle 401 Unauthorized - token refresh
    if (error.response?.status === 401 && auth.refresh && !original._retried) {
      original._retried = true;
      try {
        // A late 401 may belong to the old token, after another request refreshed it.
        if (auth.access && original.headers.Authorization !== `Bearer ${auth.access}`) {
          original.headers.Authorization = `Bearer ${auth.access}`;
          return api(original);
        }
        if (!refreshing) {
          const refreshToken = auth.refresh;
          refreshing = axios.post(`${api.defaults.baseURL}/auth/refresh/`, { refresh: refreshToken })
            .then(({data}) => {
              if (useAuthStore.getState().refresh !== refreshToken) throw new Error("Session changed");
              useAuthStore.getState().setTokens(data.access, data.refresh || refreshToken);
              return data.access as string;
            }).finally(() => { refreshing = null; });
        }
        const access = await refreshing;
        original.headers.Authorization = `Bearer ${access}`;
        return api(original);
      } catch { 
        auth.logout(); 
        return Promise.reject(error);
      }
    }

    // Handle 429 Rate Limited - exponential backoff retry
    if (error.response?.status === 429) {
      const state = retryState.get(original) || { attempt: 0, lastRetryAt: 0 };
      const maxAttempts = 5;

      if (state.attempt >= maxAttempts) {
        // Max retries exceeded - add user-friendly error
        const enhancedError = error as AxiosError & { userMessage?: string };
        enhancedError.userMessage = "The server is experiencing high load. Please try again in a few minutes.";
        return Promise.reject(enhancedError);
      }

      // Get retry delay from server or use exponential backoff
      const retryAfterHeader = error.response.headers['retry-after'];
      const serverDelay = parseRetryAfter(retryAfterHeader);
      const backoffDelay = getRetryDelay(state.attempt);
      const delay = serverDelay || backoffDelay;

      // Prevent retry if server delay is unreasonably long (> 60s)
      if (delay > 60000) {
        const enhancedError = error as AxiosError & { userMessage?: string };
        enhancedError.userMessage = "Rate limit exceeded. Please try again later.";
        return Promise.reject(enhancedError);
      }

      // Update retry state
      state.attempt++;
      state.lastRetryAt = Date.now();
      retryState.set(original, state);

      // Wait and retry
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return api(original).catch(retryError => {
        // If retry also fails, clean up state
        retryState.delete(original);
        return Promise.reject(retryError);
      });
    }

    // Handle 503 Service Unavailable - limited retry
    if (error.response?.status === 503 && !original._serviceRetried) {
      original._serviceRetried = true;
      await new Promise(resolve => setTimeout(resolve, 2000));
      return api(original);
    }

    return Promise.reject(error);
  }
);
