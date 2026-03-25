import { useState, useRef, useEffect } from "react";
import { User, LogIn, Moon, Sun } from "lucide-react";
import { useThemeStore } from "../../store/useThemeStore";
import { useNavigate } from "react-router-dom";

export default function AvatarDropdown() {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const { theme, toggleTheme } = useThemeStore();
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={ref}>

            {/* Avatar button */}
            <div
                onClick={() => setOpen(!open)}
                className="w-8 h-8 rounded-full bg-[rgb(var(--card-muted))] flex items-center justify-center cursor-pointer"
            >
                <User size={16} />
            </div>

            {/* Dropdown menu */}
            {open && (
                <div className="
          absolute right-0 mt-2 w-44 p-2
          rounded-[var(--radius)]
          bg-[rgb(var(--card))]
          border border-[rgb(var(--border))]
          shadow-lg
        ">



                    {/* Profile button */}
                    <button className="flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-[rgb(var(--card-muted))]">
                        <User size={16} />
                        Profile
                    </button>

                    {/* Theme toggle */}
                    <button
                        onClick={toggleTheme}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-[rgb(var(--card-muted))]"
                    >
                        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                        {theme === "dark" ? "Light Mode" : "Dark Mode"}
                    </button>
                    {/* Login button */}
                    <button
                        onClick={() => {
                            navigate("/login");
                            setOpen(false)
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded hover:bg-[rgb(var(--card-muted))]">
                        <LogIn size={16} />
                        Login / SignOut
                    </button>

                </div>
            )}
        </div>
    );
}