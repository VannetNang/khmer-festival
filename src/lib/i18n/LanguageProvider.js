"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { defaultLang, supportedLangs } from "./index.js";

// Language is global and persisted so switching in the Settings modal updates
// the whole interface and survives reloads.
const STORAGE_KEY = "app_language";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(defaultLang);

  // Read the saved language after mount so server and first client render match.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved && supportedLangs.includes(saved)) setLangState(saved);
    } catch {
      // localStorage can be unavailable (private mode); keep the default.
    }
  }, []);

  const setLang = (next) => {
    if (!supportedLangs.includes(next)) return;
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore write failures; the in-memory language still changes.
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
