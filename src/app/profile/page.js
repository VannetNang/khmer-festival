"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProfileEntryCard from "../../components/ProfileEntryCard.js";
import { createClient } from "../../lib/supabase/client.js";
import { getTranslations } from "../../lib/i18n/index.js";
import { useLanguage } from "../../lib/i18n/LanguageProvider.js";
import { FONT } from "../../lib/styles/fonts.js";
import { toCardEntry } from "../../lib/entries/toCardEntry.js";
import "../home.css";

const STYLES = {
  main: {
    minHeight: "100vh",
    fontFamily: FONT,
    color: "#E8EDF2",
    backgroundColor: "#14181F",
    width: "100%",
    maxWidth: "100vw",
    boxSizing: "border-box",
    overflowX: "hidden",
  },
  content: {
    maxWidth: 1100,
    width: "100%",
    margin: "0 auto",
    padding: "40px 16px 64px",
    boxSizing: "border-box",
    minHeight: "400px",
  },
  heading: { fontSize: 28, fontWeight: 700, margin: "0 0 6px", color: "#E8EDF2" },
  subtitle: { fontSize: 15, color: "#97A1B3", margin: "0 0 28px" },
  status: { fontSize: 15, color: "#B9C1CE", margin: 0 },
  link: { color: "#2EE6A8", fontWeight: 600, textDecoration: "none" },
  empty: {
    width: "100%",
    textAlign: "center",
    padding: "48px 20px",
    backgroundColor: "#1C222C",
    border: "1px dashed #3A4656",
    borderRadius: 14,
  },
  emptyTitle: { fontSize: 20, fontWeight: 700, margin: "0 0 8px", color: "#E8EDF2" },
  emptyText: { fontSize: 14, color: "#97A1B3", margin: "0 0 20px" },
  cta: {
    display: "inline-block",
    padding: "10px 22px",
    borderRadius: 999,
    backgroundColor: "#2EE6A8",
    color: "#14181F",
    fontWeight: 600,
    fontSize: 14,
    textDecoration: "none",
  },
};

// Profile: the signed-in contributor's own entries, each with Edit/Delete.
export default function ProfilePage() {
  const { lang } = useLanguage();
  const [status, setStatus] = useState("checking");
  const [entries, setEntries] = useState([]);
  const t = getTranslations(lang).profile;

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      const user = data?.user;
      if (!mounted) return;
      if (!user) {
        setStatus("anon");
        return;
      }

      supabase
        .from("archive_entries")
        .select("*")
        .eq("owner", user.id)
        .order("created_at", { ascending: false })
        .then(({ data: rows, error }) => {
          if (!mounted) return;
          if (error) {
            console.error("Could not load your entries:", error.message);
            setStatus("failed");
            return;
          }
          setEntries((rows ?? []).map(toCardEntry));
          setStatus("ready");
        });
    });

    return () => {
      mounted = false;
    };
  }, []);

  const removeEntry = (entryId) =>
    setEntries((prev) => prev.filter((entry) => entry.id !== entryId));

  return (
    <main style={STYLES.main} lang={lang}>
      <div style={STYLES.content}>
        <h1 style={STYLES.heading}>{t.title}</h1>
        <p style={STYLES.subtitle}>{t.subtitle}</p>

        {status === "checking" ? (
          <p style={STYLES.status}>{t.loading}</p>
        ) : status === "anon" ? (
          <p style={STYLES.status}>
            {t.loginPrompt}{" "}
            <Link href="/login" style={STYLES.link}>
              {t.loginLink}
            </Link>
          </p>
        ) : status === "failed" ? (
          <p style={STYLES.status}>{t.loadFailed}</p>
        ) : entries.length === 0 ? (
          <div style={STYLES.empty}>
            <p style={STYLES.emptyTitle}>{t.emptyTitle}</p>
            <p style={STYLES.emptyText}>{t.emptyText}</p>
            <Link href="/contribute" style={STYLES.cta}>
              {t.createCta}
            </Link>
          </div>
        ) : (
          <ul className="card-grid">
            {entries.map((entry) => (
              <li key={entry.id} className="card-cell">
                <ProfileEntryCard
                  entry={entry}
                  lang={lang}
                  onDeleted={removeEntry}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
