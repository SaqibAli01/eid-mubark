import { create } from "zustand";
import { login as loginUser, signup as signupUser, User } from "../utils/auth";

type AuthState = {
  user: User | null;
  loading: boolean;
  error?: string | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (
    username: string,
    password: string,
    role?: string,
    name?: string,
  ) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  login: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const user = await loginUser(username, password);
      set({ user, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Login failed", loading: false });
      throw err;
    }
  },
  signup: async (username, password, role = "cashier", name) => {
    set({ loading: true, error: null });
    try {
      const user = await signupUser(username, password, role, name);
      set({ user, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Signup failed", loading: false });
      throw err;
    }
  },
  logout: () => set({ user: null }),
}));
