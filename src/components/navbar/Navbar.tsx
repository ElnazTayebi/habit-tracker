import { useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useThemeStore } from "../../store/useThemeStore";

export default function Navbar() {
  // Global theme state from Zustand
  const { theme, toggleTheme } = useThemeStore();

  // Local state for mobile menu toggle
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full border-b border-[rgb(var(--card))] bg-[rgb(var(--card))]">
      
      {/* Container */}
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
            ✔
          </div>
          <span className="font-semibold text-lg">HabitTrack</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a href="#" className="hover:opacity-70 transition">
            Features
          </a>
          <a href="#" className="hover:opacity-70 transition">
            How It Works
          </a>
          <a href="#" className="hover:opacity-70 transition">
            About
          </a>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
           
          >
            {/* Show icon based on current theme */}
            {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Login Button */}
          <button className="px-4 py-1.5 rounded border border-[rgb(var(--card))]">
            Login
          </button>

          {/* Primary CTA */}
          <button className="px-4 py-1.5 rounded bg-blue-500 text-white">
            Get Started
          </button>

        </div>

        {/* Mobile Menu Button (Hamburger / Close) */}
        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
        >
          {/* Toggle icon */}
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-4 border-t border-[rgb(var(--card))]">

          {/* Navigation Links */}
          <a href="#" className="py-1">
            Features
          </a>
          <a href="#" className="py-1">
            How It Works
          </a>
          <a href="#" className="py-1">
            About
          </a>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-2 rounded border border-[rgb(var(--card))]"
          >
            {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
            Toggle Theme
          </button>

          {/* Login */}
          <button className="px-4 py-2 rounded border border-[rgb(var(--card))]">
            Login
          </button>

          {/* CTA */}
          <button className="px-4 py-2 rounded bg-blue-500 text-white">
            Get Started
          </button>

        </div>
      )}
    </header>
  );
}
