import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Check if user has manually toggled theme before
    const saved = localStorage.getItem("theme-mode");
    // Only use saved preference if explicitly set, otherwise default to dark
    if (saved === "light") return false;
    return true; // Default and fallback to dark mode
  });

  useEffect(() => {
    localStorage.setItem("theme-mode", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
