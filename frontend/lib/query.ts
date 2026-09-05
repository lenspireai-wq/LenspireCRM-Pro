"use client";
import {
  QueryClient,
  type QueryKey,
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/api";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: { retry: 0 },
  },
});

export const queryKeys = {
  leads: (filters?: Record<string, unknown>) => ["leads", filters ?? {}] as const,
  lead: (id: number | string) => ["leads", id] as const,
  events: (filters?: Record<string, unknown>) => ["events", filters ?? {}] as const,
  customers: (filters?: Record<string, unknown>) => ["customers", filters ?? {}] as const,
  bookings: (filters?: Record<string, unknown>) => ["bookings", filters ?? {}] as const,
  payments: (filters?: Record<string, unknown>) => ["payments", filters ?? {}] as const,
  paymentReminders: (filters?: Record<string, unknown>) => ["payment-reminders", filters ?? {}] as const,
  salesTargets: (filters?: Record<string, unknown>) => ["sales-targets", filters ?? {}] as const,
  production: (filters?: Record<string, unknown>) => ["production", filters ?? {}] as const,
  quotations: (filters?: Record<string, unknown>) => ["quotations", filters ?? {}] as const,
  contracts: (filters?: Record<string, unknown>) => ["contracts", filters ?? {}] as const,
  invoices: (filters?: Record<string, unknown>) => ["invoices", filters ?? {}] as const,
  dashboard: () => ["dashboard"] as const,
  reports: (key: string, filters?: Record<string, unknown>) => ["reports", key, filters ?? {}] as const,
  notifications: (filters?: Record<string, unknown>) => ["notifications", filters ?? {}] as const,
  notificationSummary: () => ["notifications", "summary"] as const,
  notificationPreferences: () => ["notification-preferences"] as const,
  auditOrganization: (filters?: Record<string, unknown>) => ["audit", "organization", filters ?? {}] as const,
  auditUser: (filters?: Record<string, unknown>) => ["audit", "user", filters ?? {}] as const,
  backups: () => ["backups"] as const,
  throttleMetrics: () => ["admin", "throttle-metrics"] as const,
};

export function useApiQuery<TData = unknown, TError = Error>(
  key: readonly unknown[],
  path: string,
  options?: Omit<UseQueryOptions<TData, TError, TData>, "queryKey" | "queryFn">,
) {
  return useQuery<TData, TError, TData, QueryKey>({
    queryKey: key as QueryKey,
    queryFn: async () => (await api.get(path)).data as TData,
    ...options,
  });
}

export function useApiMutation<TVariables = unknown, TData = unknown, TError = Error>(
  options?: UseMutationOptions<TData, TError, TVariables>,
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};
  return useMutation<TData, TError, TVariables>({
    ...rest,
    onSuccess: (data, variables, onMutateResult) => {
      const handler = onSuccess as ((d: TData, v: TVariables, r: unknown) => void) | undefined;
      handler?.(data, variables, onMutateResult);
      queryClient.invalidateQueries();
    },
  });
}
