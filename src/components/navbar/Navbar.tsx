import { useState } from "react";
import { useTheme } from "../../context/useTheme"
import { Menu, X, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { dark, toggleTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            HabitTrack
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="#"
              className="text-gray-700 dark:text-gray-200 hover:text-purple-500 transition-colors duration-200"
            >
              Features
            </a>
            <a
              href="#"
              className="text-gray-700 dark:text-gray-200 hover:text-purple-500 transition-colors duration-200"
            >
              Login
            </a>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1 flex items-center gap-1 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
              {dark ? "Light" : "Dark"}
            </button>

            <button className="rounded-md bg-purple-600 text-white px-4 py-2 hover:bg-purple-700 dark:bg-purple-400 dark:text-gray-900 dark:hover:bg-purple-500 transition-colors duration-200">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="text-gray-700 dark:text-gray-200 focus:outline-none"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-6 pb-4 space-y-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <a
            href="#"
            className="block text-gray-700 dark:text-gray-200 hover:text-purple-500 transition-colors duration-200"
          >
            Features
          </a>
          <a
            href="#"
            className="block text-gray-700 dark:text-gray-200 hover:text-purple-500 transition-colors duration-200"
          >
            Login
          </a>
          <button
            onClick={toggleTheme}
            className="block w-full text-left px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 flex items-center gap-1 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
            {dark ? "Light Mode" : "Dark Mode"}
          </button>
          <button className="block w-full text-left px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-400 dark:text-gray-900 dark:hover:bg-purple-500 transition-colors duration-200">
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
}//