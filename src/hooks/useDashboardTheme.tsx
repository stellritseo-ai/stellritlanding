import { createContext, useContext } from "react";

export interface DashboardThemeContextType {
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
  toggleTheme: () => void;
}

export const DashboardThemeContext = createContext<DashboardThemeContextType>({
  theme: "dark",
  setTheme: () => {},
  toggleTheme: () => {},
});

export function useDashboardTheme() {
  return useContext(DashboardThemeContext);
}
