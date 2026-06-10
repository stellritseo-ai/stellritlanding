import { ReactNode } from "react";

export default function Magnetic({ children }: { children: ReactNode; strength?: number }) {
  // Magnetic effect removed for performance
  return <>{children}</>;
}
