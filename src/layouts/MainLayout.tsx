import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";

export default function MainLayout() {
  return (
    <div className="min-h-screen">

      {/* Header */}
      <header className="flex justify-between items-center border-[rgb(var(--card))]">

        <Navbar />
      </header>

      {/* Content */}
      <main>
        <Outlet />
      </main>

    </div>
  );
}
