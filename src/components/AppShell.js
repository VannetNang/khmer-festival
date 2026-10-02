"use client";

import { useLanguage } from "../lib/i18n/LanguageProvider.js";
import Sidebar from "./Sidebar.js";
import MobileBar from "./MobileBar.js";
import "./appShell.css";

// The global shell: a fixed left sidebar on desktop/tablet, and a top bar plus
// fixed bottom nav on mobile. Auth and language state come from providers in
// the root layout, so the nav reacts immediately to sign in / sign out.
const AppShell = ({ children }) => {
  const { lang } = useLanguage();

  return (
    <div className="app-shell" lang={lang}>
      <Sidebar />
      <MobileBar />
      <div className="app-content">{children}</div>
    </div>
  );
};

export default AppShell;
