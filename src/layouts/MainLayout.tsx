
import type { ReactNode } from "react";
import { useAppStore } from "../store/useAppStore";

type Props = {
  children: ReactNode;
};

export default function MainLayout({ children }: Props) {
 // const { theme, toggleTheme } = useAppStore();

  return (
    <div className="min-h-screen">
      
      {/* Header */}
      <header className="flex justify-between items-center border-[rgb(var(--card))]">
        

   {/*      <button
          onClick={toggleTheme}
          className="px-3 py-1 rounded bg-blue-500 text-white"
        >
          {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
        </button> */}
      </header>

      {/* Content */}
      <main>
        {children}
      </main>

    </div>
  );
}
