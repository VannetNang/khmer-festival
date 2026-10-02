"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import EntryOwnerControls from "../../../components/EntryOwnerControls.js";
import { createClient } from "../../../lib/supabase/client.js";
import { getTranslations } from "../../../lib/i18n/index.js";
import { useLanguage } from "../../../lib/i18n/LanguageProvider.js";
import { FONT } from "../../../lib/styles/fonts.js";

// Read-only detail view for a single entry. It is public like the rest of the
// archive; Edit and Delete only appear when the signed-in user owns the row.

const STYLES = {
  main: {
    minHeight: "100vh",
    backgroundColor: "var(--bg)",
    color: "var(--text)",
    fontFamily: FONT,
    padding: "24px",
  },
  wrap: { maxWidth: 1000, margin: "0 auto" },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 20,
  },
  back: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 16px",
    borderRadius: 999,
    border: "1px solid var(--border)",
    backgroundColor: "var(--surface)",
    color: "var(--text)",
    fontSize: 13,
    fontWeight: 600,
    textDecoration: "none",
  },
  status: { fontSize: 15, color: "var(--text-muted)", margin: "16px 0 0" },
  card: {
    backgroundColor: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    aspectRatio: "16 / 9",
    objectFit: "cover",
    display: "block",
    backgroundColor: "var(--bg)",
  },
  body: { padding: "28px 32px 32px" },
  category: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "var(--accent-text)",
    margin: 0,
  },
  titleKhmer: { fontSize: 26, fontWeight: 700, margin: "10px 0 2px", lineHeight: 1.4 },
  titleEnglish: { fontSize: 18, fontWeight: 600, color: "var(--text-muted)", margin: "0 0 12px" },
  meta: { fontSize: 13, color: "var(--season)", margin: "0 0 20px" },
  section: { marginBottom: 20 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "var(--text-dim)",
    margin: "0 0 6px",
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 1.7,
    color: "var(--text)",
    margin: "0 0 10px",
    whiteSpace: "pre-line",
  },
  paragraphEn: {
    fontSize: 14,
    lineHeight: 1.7,
    color: "var(--text-muted)",
    margin: 0,
    whiteSpace: "pre-line",
  },
  tags: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 },
  tag: {
    fontSize: 12,
    color: "var(--text-dim)",
    backgroundColor: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: 999,
    padding: "3px 11px",
  },
  source: {
    fontSize: 13,
    lineHeight: 1.6,
    color: "var(--text-muted)",
    borderTop: "1px solid var(--border)",
    paddingTop: 16,
    margin: 0,
  },
};

export default function EntryPage() {
  const { id } = useParams();
  const { lang } = useLanguage();
  const [status, setStatus] = useState("loading");
  const [entry, setEntry] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [backHref, setBackHref] = useState("/");
  const t = getTranslations(lang).entry;
  const common = getTranslations(lang).common;

  // Send the user back to the list they came from (Home or Dashboard).
  useEffect(() => {
    const from = new URLSearchParams(window.location.search).get("from");
    setBackHref(from === "profile" ? "/profile" : "/");
  }, []);

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    Promise.all([
      supabase.from("archive_entries").select("*").eq("id", id).single(),
      supabase.auth.getUser(),
    ]).then(([entryRes, userRes]) => {
      if (!mounted) return;

      if (entryRes.error || !entryRes.data) {
        if (entryRes.error) {
          console.error("Loading entry failed:", entryRes.error.message);
        }
        setStatus("notfound");
        return;
      }

      setEntry(entryRes.data);
      const user = userRes.data?.user;
      setIsOwner(Boolean(user && user.id === entryRes.data.owner));
      setStatus("ready");
    });

    return () => {
      mounted = false;
    };
  }, [id]);

  return (
    <main style={STYLES.main} lang={lang}>
      <div style={STYLES.wrap}>
        <div style={STYLES.header}>
          <Link href={backHref} style={STYLES.back}>
            <span aria-hidden="true">←</span>
            {common.back}
          </Link>
          {entry ? (
            <EntryOwnerControls
              entryId={entry.id}
              entryTitle={lang === "km" ? entry.title_khmer : entry.title_english}
              isOwner={isOwner}
              lang={lang}
              inline
            />
          ) : null}
        </div>

        {status === "loading" ? (
          <p style={STYLES.status}>{t.loading}</p>
        ) : status === "notfound" || !entry ? (
          <p style={STYLES.status}>{t.notFound}</p>
        ) : (
          <>
            <article style={STYLES.card}>
              {entry.image_path ? (
                <img
                  src={entry.image_path}
                  alt={entry.title_english}
                  style={STYLES.image}
                />
              ) : null}
              <div style={STYLES.body}>
                <p style={STYLES.category}>{entry.category}</p>
                <h1 style={STYLES.titleKhmer} lang="km">
                  {entry.title_khmer}
                </h1>
                <p style={STYLES.titleEnglish}>{entry.title_english}</p>
                <p style={STYLES.meta}>{entry.season_or_month}</p>

                <div style={STYLES.section}>
                  <p style={STYLES.sectionLabel}>{t.khmerLabel}</p>
                  <p style={STYLES.paragraph} lang="km">
                    {entry.description_khmer}
                  </p>
                </div>

                <div style={STYLES.section}>
                  <p style={STYLES.sectionLabel}>{t.englishLabel}</p>
                  <p style={STYLES.paragraphEn}>{entry.description_english}</p>
                </div>

                {(entry.tags ?? []).length > 0 ? (
                  <div style={STYLES.section}>
                    <p style={STYLES.sectionLabel}>{t.tagsLabel}</p>
                    <div style={STYLES.tags}>
                      {entry.tags.map((tag) => (
                        <span key={tag} style={STYLES.tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                <p style={STYLES.source}>
                  {t.sourceLabel}: {entry.source}
                </p>
              </div>

            </article>
          </>
        )}

      </div>
    </main>
  );
}
