"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BackLink from "../../components/BackLink.js";
import LanguageToggle from "../../components/LanguageToggle.js";
import Spinner from "../../components/Spinner.js";
import { useAuth } from "../../lib/auth/AuthProvider.js";
import { useLanguage } from "../../lib/i18n/LanguageProvider.js";
import { getTranslations } from "../../lib/i18n/index.js";
import { FONT } from "../../lib/styles/fonts.js";

const STYLES = {
  main: {
    minHeight: "100vh",
    padding: "24px",
    backgroundColor: "#14181F",
    color: "#E8EDF2",
    fontFamily: FONT,
  },
  wrap: { maxWidth: 640, margin: "0 auto" },
  title: { fontSize: 26, fontWeight: 700, margin: "0 0 6px", color: "#E8EDF2" },
  subtitle: { fontSize: 14, color: "#97A1B3", margin: "0 0 24px" },
  section: {
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 14,
    padding: "20px 22px",
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#97A1B3",
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
    backgroundColor: "#2EE6A8",
    color: "#14181F",
    fontSize: 20,
    fontWeight: 700,
    flexShrink: 0,
  },
  accountName: { margin: 0, fontSize: 16, fontWeight: 700, color: "#E8EDF2" },
  accountEmail: { margin: "2px 0 0", fontSize: 13, color: "#97A1B3" },
  muted: { margin: 0, fontSize: 14, color: "#B9C1CE" },
  link: { color: "#2EE6A8", fontWeight: 600, textDecoration: "none" },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#B9C1CE",
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
    color: "#FF5C5C",
    backgroundColor: "transparent",
    border: "1px solid rgba(255,92,92,0.5)",
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
        <BackLink />

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
