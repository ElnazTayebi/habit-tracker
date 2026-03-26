import { useState } from "react";
import { Menu, Plus, X } from "lucide-react";
import { Link } from "react-router-dom";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";
import AvatarDropdown from "./AvatarDropdown";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full border-b border-[rgb(var(--border))] bg-[rgb(var(--card))]">
      
      {/* Main container */}
      <div className="w-full px-6 py-3 flex items-center justify-between">

        {/* Logo (left side) */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
            ✔
          </div>
          <span className="font-semibold text-lg">HabitTrack</span>
        </Link>

        {/* Desktop navigation (hidden on mobile) */}
        <div className="hidden md:flex flex-1 justify-end mr-10">
          <NavLinks />
        </div>

        {/* Right section (always on right) */}
        <div className="flex items-center gap-3">

          {/* Desktop button */}
          <Link 
          to="/add-habit"
          className="flex items-center gap-2 hidden md:flex px-3 py-1.5 rounded border border-[rgb(var(--border))]">
            <Plus size={16} />
            Add Habit
          </Link>

          {/* Avatar dropdown */}
          <AvatarDropdown />

          {/* Mobile menu toggle */}
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <MobileMenu open={open} setOpen={setOpen} />

    </header>
  );
}