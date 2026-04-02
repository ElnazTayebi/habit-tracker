import { Link } from "react-router-dom";

type Props = {
  direction?: "row" | "col";
  onClick?: () => void;
}
export default function NavLinks({direction = "row", onClick}:Props) {
  return (
    <nav 
    className={`
    flex 
    ${direction === "row" ? "items-center gap-6" : "flex-col gap-4"}
    text-sm`}>

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