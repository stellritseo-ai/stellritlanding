import { useLocation } from "react-router-dom";
import type { ReactNode } from "react";

export default function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  return (
    
      <div key={pathname}>
        {children}
      </div>
    
  );
}
