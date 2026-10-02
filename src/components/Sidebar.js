"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "../lib/i18n/LanguageProvider.js";
import { useAuth } from "../lib/auth/AuthProvider.js";
import { getTranslations } from "../lib/i18n/index.js";
import { HomeIcon, PlusIcon, DashboardIcon, GearIcon } from "./AppIcons.js";
import LanguageToggle from "./LanguageToggle.js";
import ThemeToggle from "./ThemeToggle.js";
import Spinner from "./Spinner.js";
import { isNavActive } from "../lib/nav/isNavActive.js";

const displayName = (user) =>
  user?.user_metadata?.display_name || user?.email?.split("@")[0] || "";

// Fixed left sidebar for desktop + tablet.
const Sidebar = () => {
  const { lang } = useLanguage();
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const t = getTranslations(lang).nav;
  const tt = getTranslations(lang).theme;
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const wrapRef = useRef(null);

  // Close the settings popover on outside click or Escape.
  useEffect(() => {
    if (!settingsOpen) return;
    const onPointerDown = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        setSettingsOpen(false);
      }
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setSettingsOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [settingsOpen]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      router.push("/");
    } finally {
      setLoggingOut(false);
    }
  };

  const items = [
    { href: "/", label: t.home, Icon: HomeIcon },
    { href: "/contribute", label: t.createEntry, Icon: PlusIcon },
    { href: "/profile", label: t.dashboard, Icon: DashboardIcon },
  ];

  return (
    <aside className="app-sidebar">
      <div className="sidebar-top">
        <span className="sidebar-title">{t.appTitle}</span>
      </div>

      <nav className="sidebar-nav">
        {items.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className={isNavActive(pathname, href) ? "sidebar-link is-active" : "sidebar-link"}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-settings-wrap" ref={wrapRef}>
          {settingsOpen ? (
            <div className="sidebar-popover" role="dialog" aria-label={t.settings}>
              <p className="popover-title">{t.language}</p>
              <LanguageToggle />
              <p className="popover-title" style={{ marginTop: 16 }}>
                {tt.label}
              </p>
              <ThemeToggle />
            </div>
          ) : null}
          <button
            type="button"
            className="sidebar-settings"
            onClick={() => setSettingsOpen((open) => !open)}
            aria-expanded={settingsOpen}
          >
            <GearIcon size={18} />
            {t.settings}
          </button>
        </div>

        {user ? (
          <div className="sidebar-user">
            <span className="sidebar-avatar">
              {displayName(user).charAt(0).toUpperCase()}
            </span>
            <span className="sidebar-email" title={user.email}>
              {user.email}
            </span>
            <button
              type="button"
              className="sidebar-logout"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut ? <Spinner /> : null}
              {loggingOut ? t.loggingOut : t.logout}
            </button>
          </div>
        ) : (
          <div className="sidebar-auth">
            <Link href="/login" className="sidebar-auth-btn">
              {t.logIn}
            </Link>
            <Link href="/signup" className="sidebar-auth-btn">
              {t.register}
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
