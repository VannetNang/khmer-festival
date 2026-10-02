"use client";

import { useState } from "react";
import { useLanguage } from "../lib/i18n/LanguageProvider.js";
import { getTranslations } from "../lib/i18n/index.js";
import { GlobeIcon } from "./AppIcons.js";
import Spinner from "./Spinner.js";

// Reusable English / Khmer switch (used by the sidebar popover and the mobile
// settings view). Language persists through LanguageProvider -> localStorage.
const LanguageToggle = () => {
  const { lang, setLang } = useLanguage();
  const t = getTranslations(lang).nav;
  const [switching, setSwitching] = useState(null);

  const select = (next) => {
    if (next === lang || switching) return;
    // The change itself is synchronous; the brief busy state makes the
    // feedback visible and blocks double clicks.
    setSwitching(next);
    setLang(next);
    window.setTimeout(() => setSwitching(null), 300);
  };

  const renderOption = (code, label) => {
    const busy = switching === code;
    return (
      <button
        type="button"
        className={busy || lang === code ? "lang-option is-active" : "lang-option"}
        onClick={() => select(code)}
        disabled={switching !== null}
      >
        {busy ? <Spinner /> : <GlobeIcon size={16} />}
        {busy ? `${label}...` : label}
      </button>
    );
  };

  return (
    <div className="lang-toggle" role="group" aria-label={t.language}>
      {renderOption("en", t.english)}
      {renderOption("km", t.khmer)}
    </div>
  );
};

export default LanguageToggle;
