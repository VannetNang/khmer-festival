"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MyEntryCard from "../../components/MyEntryCard.js";
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
    color: "var(--text)",
    backgroundColor: "var(--bg)",
    width: "100%",
    maxWidth: "100vw",
    boxSizing: "border-box",
    overflowX: "hidden",
  },
  content: {
    maxWidth: 1300,
    width: "100%",
    margin: "0 auto",
    padding: "40px 16px 64px",
    boxSizing: "border-box",
    minHeight: "400px",
  },
  heading: { fontSize: 28, fontWeight: 700, margin: "0 0 6px", color: "var(--text)" },
  subtitle: { fontSize: 15, color: "var(--text-dim)", margin: "0 0 28px" },
  status: { fontSize: 15, color: "var(--text-muted)", margin: 0 },
  link: { color: "var(--accent-text)", fontWeight: 600, textDecoration: "none" },
  empty: {
    width: "100%",
    textAlign: "center",
    padding: "48px 20px",
    backgroundColor: "var(--surface)",
    border: "1px dashed var(--border-strong)",
    borderRadius: 14,
  },
  emptyTitle: { fontSize: 20, fontWeight: 700, margin: "0 0 8px", color: "var(--text)" },
  emptyText: { fontSize: 14, color: "var(--text-dim)", margin: "0 0 20px" },
  cta: {
    display: "inline-block",
    padding: "10px 22px",
    borderRadius: 999,
    backgroundColor: "var(--accent)",
    color: "var(--accent-contrast)",
    fontWeight: 600,
    fontSize: 14,
    textDecoration: "none",
  },
  tabs: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    margin: "0 0 24px",
  },
  tab: {
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: 600,
    color: "var(--text-muted)",
    backgroundColor: "var(--surface)",
    // No border shorthand: the active tab toggles only borderColor, so these
    // must be separate longhands or React would warn about the mixed diff.
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "var(--border-strong)",
    borderRadius: 999,
    padding: "8px 14px",
    cursor: "pointer",
  },
  tabActive: {
    color: "var(--accent-contrast)",
    backgroundColor: "var(--accent)",
    borderColor: "var(--accent-text)",
  },
};

// My Entries: the signed-in user's own entries with their review status shown
// on every card. Logged-out visitors are prompted to sign in instead.
export default function MyEntriesPage() {
  const { lang } = useLanguage();
  const [status, setStatus] = useState("checking");
  const [entries, setEntries] = useState([]);
  // Status filter tabs: "all" shows everything; otherwise only that status.
  const [filter, setFilter] = useState("all");
  const t = getTranslations(lang).myEntries;

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
            console.error("Could not load my entries:", error.message);
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

  // "all" tab shows every entry; the other tabs show only that status.
  const visibleEntries =
    filter === "all" ? entries : entries.filter((entry) => entry.status === filter);

  return (
    <main style={STYLES.main} lang={lang}>
      <div style={STYLES.content}>
        <h1 style={STYLES.heading}>{t.title}</h1>
        <p style={STYLES.subtitle}>{t.subtitle}</p>

        {status === "ready" ? (
          <div style={STYLES.tabs} role="group" aria-label={t.filters.all}>
            {["all", "pending", "published", "returned"].map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                style={
                  filter === key
                    ? { ...STYLES.tab, ...STYLES.tabActive }
                    : STYLES.tab
                }
                aria-pressed={filter === key}
              >
                {t.filters[key]}
              </button>
            ))}
          </div>
        ) : null}

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
        ) : visibleEntries.length === 0 ? (
          <div style={STYLES.empty}>
            <p style={STYLES.emptyTitle}>{t.emptyTitle}</p>
            <p style={STYLES.emptyText}>{t.emptyText}</p>
            <Link href="/contribute" style={STYLES.cta}>
              {t.createCta}
            </Link>
          </div>
        ) : (
          <ul className="card-grid">
            {visibleEntries.map((entry) => (
              <li key={entry.id} className="card-cell">
                <MyEntryCard entry={entry} lang={lang} onDeleted={removeEntry} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
