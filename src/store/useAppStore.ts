import { create } from "zustand";

export type Theme = "light" | "dark";

type AppStore = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const getInitialTheme = (): Theme => {
  const saved = localStorage.getItem("theme") as Theme | null;
  if (saved) return saved;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const useAppStore = create<AppStore>((set) => ({
  theme: getInitialTheme(),

  setTheme: (theme) => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);

    localStorage.setItem("theme", theme);

    set({ theme });
  },

  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";

      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(newTheme);

      localStorage.setItem("theme", newTheme);

      return { theme: newTheme };
    }),
}))
