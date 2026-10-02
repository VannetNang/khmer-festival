"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../lib/supabase/client.js";
import { getTranslations } from "../lib/i18n/index.js";
import "./topbar.css";

// The application top bar. It tracks the session itself so any page can render
// it. When signed in it shows Create Entry and Profile next to each other,
// followed by Logout; when signed out it shows Login and Sign Up.
const TopBar = ({ lang, onLangChange }) => {
  const [userEmail, setUserEmail] = useState(null);
  const t = getTranslations(lang).home;

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      if (mounted && data?.user?.email) setUserEmail(data.user.email);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await createClient().auth.signOut();
  };

  return (
    <header className="app-topbar">
      <span className="topbar-brand">{t.brand}</span>

      <div className="topbar-toggle" role="group" aria-label="Language">
        <button
          type="button"
          className={lang === "km" ? "topbar-toggle-btn is-active" : "topbar-toggle-btn"}
          onClick={() => onLangChange("km")}
        >
          <span className="topbar-short-label">KH</span>
          <span className="topbar-full-label">Khmer</span>
        </button>
        <button
          type="button"
          className={lang === "en" ? "topbar-toggle-btn is-active" : "topbar-toggle-btn"}
          onClick={() => onLangChange("en")}
        >
          <span className="topbar-short-label">EN</span>
          <span className="topbar-full-label">English</span>
        </button>
      </div>

      {userEmail ? (
        <div className="topbar-auth">
          <span className="topbar-user">{userEmail}</span>
          <Link href="/contribute" className="topbar-link">
            {t.createEntryTitle}
          </Link>
          <Link href="/profile" className="topbar-link">
            {t.profileTitle}
          </Link>
          <button type="button" className="topbar-logout" onClick={handleLogout}>
            {t.logoutTitle}
          </button>
        </div>
      ) : (
        <div className="topbar-auth">
          <Link href="/login" className="topbar-link">
            {t.loginTitle}
          </Link>
          <Link href="/signup" className="topbar-link">
            {t.signUpTitle}
          </Link>
        </div>
      )}
    </header>
  );
};

export default TopBar;
