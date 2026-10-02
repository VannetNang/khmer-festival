"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "../lib/i18n/LanguageProvider.js";
import { useAuth } from "../lib/auth/AuthProvider.js";
import { getTranslations } from "../lib/i18n/index.js";
import {
  HomeIcon,
  DashboardIcon,
  PlusIcon,
  GearIcon,
  GlobeIcon,
  SparklesIcon,
} from "./AppIcons.js";
import Spinner from "./Spinner.js";
import { isNavActive } from "../lib/nav/isNavActive.js";

const displayName = (user) =>
  user?.user_metadata?.display_name || user?.email?.split("@")[0] || "";

// Mobile top bar + fixed bottom navigation.
const MobileBar = () => {
  const { lang, setLang } = useLanguage();
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const t = getTranslations(lang).nav;
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      router.push("/");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      <header className="mobile-topbar">
        <Link href="/" className="mobile-title">
          <span className="brand-icon">
            <SparklesIcon size={18} />
          </span>
          <span className="mobile-title-text">{t.appTitle}</span>
        </Link>

        <div className="mobile-topbar-right">
          {user ? (
            <div className="mobile-user">
              <span className="mobile-avatar">
                {displayName(user).charAt(0).toUpperCase()}
              </span>
              <span className="mobile-user-name">{displayName(user)}</span>
              <button
                type="button"
                className="mobile-logout"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? <Spinner /> : null}
                {loggingOut ? t.loggingOut : t.logout}
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="mobile-auth">
                {t.logIn}
              </Link>
              <Link href="/signup" className="mobile-auth">
                {t.register}
              </Link>
            </>
          )}
          <button
            type="button"
            className="mobile-lang"
            onClick={() => setLang(lang === "km" ? "en" : "km")}
            aria-label={t.language}
          >
            <GlobeIcon size={16} />
            {lang === "km" ? "KH" : "EN"}
          </button>
        </div>
      </header>

      <nav className="mobile-bottomnav">
        <Link
          href="/"
          className={
            isNavActive(pathname, "/") ? "mobile-nav-item is-active" : "mobile-nav-item"
          }
        >
          <HomeIcon size={20} />
          {t.home}
        </Link>
        <Link
          href="/contribute"
          className={
            isNavActive(pathname, "/contribute") ? "mobile-nav-item is-active" : "mobile-nav-item"
          }
        >
          <PlusIcon size={20} />
          {t.createEntry}
        </Link>
        <Link
          href="/profile"
          className={
            isNavActive(pathname, "/profile") ? "mobile-nav-item is-active" : "mobile-nav-item"
          }
        >
          <DashboardIcon size={20} />
          {t.dashboard}
        </Link>
        <Link
          href="/settings"
          className={
            isNavActive(pathname, "/settings") ? "mobile-nav-item is-active" : "mobile-nav-item"
          }
        >
          <GearIcon size={20} />
          {t.settings}
        </Link>
      </nav>
    </>
  );
};

export default MobileBar;
