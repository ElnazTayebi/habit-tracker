import type { ReactNode } from "react";
import { useAppStore } from "../store/useAppStore";

type Props = {
    children: ReactNode;
}

const MainLayout = ({children}: Props) => {
    const {theme, toggleTheme} = useAppStore();
    return (
        <div className="min-h-screen ">

            <header className="p-4 flex justify-between items-center  border-[rgb(var(--card))]">
                
                <button 
                onClick={toggleTheme}
                className="px-3 py-1 rounded bg-blue-500 text-white"
                >
                    {theme === "dark" ? "Dark" : "Light"}
                </button>
            </header>
          {/*  Content */}
          <main className="p-6">{children}</main>
            
        </div>
    )
}
export default MainLayout;