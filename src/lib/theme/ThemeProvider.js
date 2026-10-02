"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Theme is global and persisted, mirroring the language provider.
const STORAGE_KEY = "app_theme";
const DEFAULT_THEME = "dark";
const THEMES = ["dark", "light"];

const ThemeContext = createContext({ theme: DEFAULT_THEME, setTheme: () => {} });

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(DEFAULT_THEME);

  // Restore the saved theme after mount (server + first client render are dark).
  useEffect(() => {
    let initial = DEFAULT_THEME;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved && THEMES.includes(saved)) initial = saved;
    } catch {
      // localStorage can be unavailable; keep the default.
    }
    setThemeState(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const setTheme = (next) => {
    if (!THEMES.includes(next)) return;
    setThemeState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore write failures; the in-memory theme still changes.
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
