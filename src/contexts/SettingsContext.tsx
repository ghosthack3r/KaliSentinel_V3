import React, { createContext, useContext, useState, useEffect } from "react";

type AppTheme = "green" | "blue" | "amber" | "rose";
type PageTransition = "fade" | "slide" | "scale" | "glitch";

interface SettingsContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  transitionType: PageTransition;
  setTransitionType: (type: PageTransition) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<AppTheme>(() => {
    return (localStorage.getItem("app-theme") as AppTheme) || "green";
  });
  
  const [transitionType, setTransitionType] = useState<PageTransition>(() => {
    return (localStorage.getItem("app-transition") as PageTransition) || "fade";
  });

  useEffect(() => {
    localStorage.setItem("app-theme", theme);
    document.body.classList.remove("app-theme-green", "app-theme-blue", "app-theme-amber", "app-theme-rose");
    document.body.classList.add(`app-theme-${theme}`);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("app-transition", transitionType);
  }, [transitionType]);

  return (
    <SettingsContext.Provider value={{ theme, setTheme, transitionType, setTransitionType }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
