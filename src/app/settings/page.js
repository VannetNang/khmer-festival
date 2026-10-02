"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LanguageToggle from "../../components/LanguageToggle.js";
import ThemeToggle from "../../components/ThemeToggle.js";
import Spinner from "../../components/Spinner.js";
import { useAuth } from "../../lib/auth/AuthProvider.js";
import { useLanguage } from "../../lib/i18n/LanguageProvider.js";
import { getTranslations } from "../../lib/i18n/index.js";
import { FONT } from "../../lib/styles/fonts.js";

const STYLES = {
  main: {
    minHeight: "100vh",
    padding: "24px",
    backgroundColor: "var(--bg)",
    color: "var(--text)",
    fontFamily: FONT,
  },
  wrap: { maxWidth: 640, margin: "0 auto" },
  title: { fontSize: 26, fontWeight: 700, margin: "0 0 6px", color: "var(--text)" },
  subtitle: { fontSize: 14, color: "var(--text-dim)", margin: "0 0 24px" },
  section: {
    backgroundColor: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    padding: "20px 22px",
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "var(--text-dim)",
    margin: "0 0 14px",
  },
  accountRow: { display: "flex", alignItems: "center", gap: 14 },
  avatar: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    height: 48,
    borderRadius: "50%",
    backgroundColor: "var(--accent)",
    color: "var(--accent-contrast)",
    fontSize: 20,
    fontWeight: 700,
    flexShrink: 0,
  },
  accountName: { margin: 0, fontSize: 16, fontWeight: 700, color: "var(--text)" },
  accountEmail: { margin: "2px 0 0", fontSize: 13, color: "var(--text-dim)" },
  muted: { margin: 0, fontSize: 14, color: "var(--text-muted)" },
  link: { color: "var(--accent-text)", fontWeight: 600, textDecoration: "none" },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "var(--text-muted)",
    marginBottom: 10,
  },
  logout: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    marginTop: 20,
    padding: "12px 14px",
    fontSize: 15,
    fontWeight: 700,
    fontFamily: FONT,
    color: "var(--danger)",
    backgroundColor: "transparent",
    border: "1px solid var(--danger-border-strong)",
    borderRadius: 10,
    cursor: "pointer",
  },
};

// Dedicated settings view (mobile bottom nav -> /settings).
export default function SettingsPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const { user, loading, signOut } = useAuth();
  const t = getTranslations(lang).settings;
  const nav = getTranslations(lang).nav;
  const themeT = getTranslations(lang).theme;
  const name = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "";
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
    <main style={STYLES.main} lang={lang}>
      <div style={STYLES.wrap}>
        <h1 style={STYLES.title}>{t.title}</h1>
        <p style={STYLES.subtitle}>{t.subtitle}</p>

        <section style={STYLES.section}>
          <h2 style={STYLES.sectionTitle}>{t.account}</h2>
          {loading ? (
            <p style={STYLES.muted}>…</p>
          ) : user ? (
            <div style={STYLES.accountRow}>
              <span style={STYLES.avatar}>{name.charAt(0).toUpperCase()}</span>
              <div>
                <p style={STYLES.accountName}>{name}</p>
                <p style={STYLES.accountEmail}>{user.email}</p>
              </div>
            </div>
          ) : (
            <p style={STYLES.muted}>
              {t.signedOut}{" "}
              <Link href="/login" style={STYLES.link}>
                {nav.logIn}
              </Link>
            </p>
          )}
        </section>

        <section style={STYLES.section}>
          <h2 style={STYLES.sectionTitle}>{t.preferences}</h2>
          <span style={STYLES.label}>{nav.language}</span>
          <LanguageToggle />
          <span style={{ ...STYLES.label, marginTop: 18 }}>{themeT.label}</span>
          <ThemeToggle />
          {user ? (
            <button
              type="button"
              style={STYLES.logout}
              onClick={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut ? <Spinner /> : null}
              {loggingOut ? nav.loggingOut : nav.logout}
            </button>
          ) : null}
        </section>
      </div>
    </main>
  );
}
