import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SessionUser as User } from "@/lib/permissions";
type AuthState = {
  access: string | null;
  refresh: string | null;
  user: User | null;
  setSession: (access: string, refresh: string, user: User) => void;
  setTokens: (access: string, refresh: string) => void;
  logout: () => void;
};
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      access: null,
      refresh: null,
      user: null,
      setSession: (access, refresh, user) => set({ access, refresh, user }),
      setTokens: (access, refresh) => set({ access, refresh }),
      logout: () => set({ access: null, refresh: null, user: null }),
    }),
    { name: "lenspire-auth" },
  ),
);
