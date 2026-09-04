import axios from "axios";
import { useAuthStore } from "@/stores/auth";

export type { components, paths, operations } from "./api-types";
export type PathResponse<T extends keyof import("./api-types").paths> =
  import("./api-types").paths[T] extends { get: { responses: any } }
    ? import("./api-types").paths[T]["get"]["responses"]
    : never;

export const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api" });
let refreshing: Promise<string> | null = null;
api.interceptors.request.use(config => {
  const token = useAuthStore.getState().access;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(response => response, async error => {
  const original = error.config;
  const auth = useAuthStore.getState();
  if (error.response?.status === 401 && auth.refresh && original && !original._retried) {
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
    } catch { auth.logout(); }
  }
  return Promise.reject(error);
});
