import { createContext, useContext } from "react";

export const DashboardThemeContext = createContext<{ theme: "dark" | "light" }>({ theme: "dark" });

export function useDashboardTheme() {
  return useContext(DashboardThemeContext);
}
