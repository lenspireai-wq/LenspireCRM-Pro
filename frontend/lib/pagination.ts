import { api } from "./api";

export type Page<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type PagedQuery = {
  search?: string;
  ordering?: string;
  page?: number;
  pageSize?: number;
  filters?: Record<string, string | number | boolean | undefined>;
};

const buildParams = (q: PagedQuery): URLSearchParams => {
  const params = new URLSearchParams();
  if (q.search) params.set("search", q.search);
  if (q.ordering) params.set("ordering", q.ordering);
  if (q.page) params.set("page", String(q.page));
  if (q.pageSize) params.set("page_size", String(q.pageSize));
  if (q.filters) {
    for (const [key, value] of Object.entries(q.filters)) {
      if (value === undefined || value === null || value === "") continue;
      params.set(key, String(value));
    }
  }
  return params;
};

export async function fetchPage<T>(path: string, query: PagedQuery = {}): Promise<Page<T>> {
  const separator = path.includes("?") ? "&" : "?";
  const url = `${path}${separator}${buildParams(query).toString()}`;
  const { data } = await api.get(url);
  if (Array.isArray(data)) {
    return { count: data.length, next: null, previous: null, results: data as T[] };
  }
  return {
    count: data?.count ?? (data?.results?.length ?? 0),
    next: data?.next ?? null,
    previous: data?.previous ?? null,
    results: (data?.results ?? []) as T[],
  };
}

export function uniqById<T extends { id: number }>(items: T[]): T[] {
  const seen = new Set<number>();
  const out: T[] = [];
  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    out.push(item);
  }
  return out;
}
