"use client";

import { create } from "zustand";
import { authAPI } from "../lib/api";

export type User = {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  credits: number;
  hasPurchased?: boolean;
};

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  initFromStorage: () => void;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  loading: false,
  initFromStorage: async () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (token && !get().user) {
      set({ token, loading: true });
      try {
        const { data } = await authAPI.getMe();
        set({ user: data.user, loading: false });
      } catch {
        localStorage.removeItem("token");
        set({ token: null, user: null, loading: false });
      }
    }
  },
  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    set({ token: null, user: null });
  },
}));
