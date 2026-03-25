import { Link } from "react-router-dom";

export default function NavLinks() {
  return (
    <nav className="flex items-center gap-6 text-sm">

      {/* Navigation links */}
      <Link to="/" className="hover:opacity-70">
        Dashboard
      </Link>

      <Link to="/" className="hover:opacity-70">
        Reports
      </Link>

    

    </nav>
  );
}