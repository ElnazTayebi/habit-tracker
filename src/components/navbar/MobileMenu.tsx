import { Plus, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { useThemeStore } from "../../store/useThemeStore";

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

export default function MobileMenu({ open, setOpen }: Props) {
  const { theme, toggleTheme } = useThemeStore();

  // If menu is closed → render nothing
  if (!open) return null;

  return (
    <div className="
      md:hidden
      px-6 pb-4
      flex flex-col gap-4
      border-t border-[rgb(var(--border))]
      bg-[rgb(var(--card))]
    ">

      {/* Navigation links */}
      <Link to="/" onClick={() => setOpen(false)}>Dashboard</Link>
      <Link to="/" onClick={() => setOpen(false)}>Reports</Link>


      {/* Add habit button */}
      <Link
        to="/add-habit"
        className="flex items-center gap-2 block px-4 py-2"
        onClick={() => setOpen(false)}
      >
        <Plus size={16} />
        Add Habit
      </Link>

      {/* Theme toggle */}
      <button onClick={toggleTheme} className="flex items-center gap-2">
        {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
        Toggle Theme
      </button>

    </div>
  );
}