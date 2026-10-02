"use client";

import { useTheme } from "../lib/theme/ThemeProvider.js";
import { getTranslations } from "../lib/i18n/index.js";
import { useLanguage } from "../lib/i18n/LanguageProvider.js";
import { SunIcon, MoonIcon } from "./AppIcons.js";

// Light / dark switch (used by the sidebar popover and the settings view).
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const { lang } = useLanguage();
  const t = getTranslations(lang).theme;

  return (
    <div className="theme-toggle" role="group" aria-label={t.label}>
      <button
        type="button"
        className={theme === "light" ? "theme-option is-active" : "theme-option"}
        onClick={() => setTheme("light")}
      >
        <SunIcon size={16} />
        {t.light}
      </button>
      <button
        type="button"
        className={theme === "dark" ? "theme-option is-active" : "theme-option"}
        onClick={() => setTheme("dark")}
      >
        <MoonIcon size={16} />
        {t.dark}
      </button>
    </div>
  );
};

export default ThemeToggle;
