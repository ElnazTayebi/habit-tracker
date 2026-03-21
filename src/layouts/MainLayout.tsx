
import type { ReactNode } from "react";


type Props = {
  children: ReactNode;
};

export default function MainLayout({ children }: Props) {


  return (
    <div className="min-h-screen">
      
      {/* Header */}
      <header className="flex justify-between items-center border-[rgb(var(--card))]">
        

      </header>

      {/* Content */}
      <main>
        {children}
      </main>

    </div>
  );
}
