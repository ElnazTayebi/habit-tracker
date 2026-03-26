import { create } from "zustand";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../../firebase";

type AuthStore = {
  user: any;
  loading: boolean;

  signup: (email: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>; // ← تغییر: logout async
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: false,

  signup: async (email, password) => {
    set({ loading: true });
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      set({ user: res.user });
      return res.user;
    } finally {
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      set({ user: res.user });
      return res.user;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await signOut(auth);  // Firebase
      set({ user: null });  //state
    } catch (error) {
    throw error;
  } finally {
    set({ loading: false });
    }
  },
}));