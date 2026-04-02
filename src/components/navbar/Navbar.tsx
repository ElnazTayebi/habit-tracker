import { useState } from "react";
import { Menu, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";
import AvatarDropdown from "./AvatarDropdown";
import { useHabitStore } from "../../store/habit/useHabitStore";


export default function Navbar() {
  const [open, setOpen] = useState(false);
  const setEditingHabit = useHabitStore((s) => s.setEditingHabit)
  const navigate = useNavigate();

  return (
    <header className="w-full max-w-4xl mx-auto  border-[rgb(var(--border))] ">
      
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
          <button 
          onClick={() => {
            setEditingHabit(null);
            navigate("/add-habit")
          }}
          
          className="flex items-center gap-2 hidden md:flex px-3 py-1.5 rounded border border-[rgb(var(--border))]">
            <Plus size={16} />
            Add Habit
          </button>

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