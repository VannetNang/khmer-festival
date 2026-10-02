"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BackLink from "../../../components/BackLink.js";
import EntryOwnerControls from "../../../components/EntryOwnerControls.js";
import { createClient } from "../../../lib/supabase/client.js";
import { getTranslations } from "../../../lib/i18n/index.js";

// Read-only detail view for a single entry. It is public like the rest of the
// archive; Edit and Delete only appear when the signed-in user owns the row.
const FONT =
  "'Kantumruy Pro', 'Inter', 'Noto Sans Khmer', system-ui, -apple-system, sans-serif";

const STYLES = {
  main: {
    minHeight: "100vh",
    backgroundColor: "#14181F",
    color: "#E8EDF2",
    fontFamily: FONT,
    padding: "24px",
  },
  wrap: { maxWidth: 760, margin: "0 auto" },
  top: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  toggle: {
    display: "flex",
    gap: 4,
    width: "fit-content",
    padding: 3,
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 999,
  },
  toggleBtn: {
    height: 30,
    padding: "0 14px",
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: 600,
    color: "#97A1B3",
    background: "transparent",
    border: "none",
    borderRadius: 999,
    cursor: "pointer",
  },
  toggleActive: { fontWeight: 700, color: "#14181F", backgroundColor: "#2EE6A8" },
  status: { fontSize: 15, color: "#B9C1CE", margin: "16px 0 0" },
  card: {
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 16,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    aspectRatio: "16 / 9",
    objectFit: "cover",
    display: "block",
    backgroundColor: "#14181F",
  },
  body: { padding: "28px 32px 32px" },
  category: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#2EE6A8",
    margin: 0,
  },
  titleKhmer: { fontSize: 26, fontWeight: 700, margin: "10px 0 2px", lineHeight: 1.4 },
  titleEnglish: { fontSize: 18, fontWeight: 600, color: "#B9C1CE", margin: "0 0 12px" },
  meta: { fontSize: 13, color: "#7FD8B4", margin: "0 0 20px" },
  section: { marginBottom: 20 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#97A1B3",
    margin: "0 0 6px",
  },
  paragraph: { fontSize: 15, lineHeight: 1.7, color: "#E8EDF2", margin: "0 0 10px" },
  paragraphEn: { fontSize: 14, lineHeight: 1.7, color: "#B9C1CE", margin: 0 },
  tags: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 },
  tag: {
    fontSize: 12,
    color: "#97A1B3",
    backgroundColor: "#14181F",
    border: "1px solid #2E3644",
    borderRadius: 999,
    padding: "3px 11px",
  },
  source: {
    fontSize: 13,
    lineHeight: 1.6,
    color: "#B9C1CE",
    borderTop: "1px solid #2E3644",
    paddingTop: 16,
    margin: 0,
  },
};

export default function EntryPage() {
  const { id } = useParams();
  const [lang, setLang] = useState("km");
  const [status, setStatus] = useState("loading");
  const [entry, setEntry] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const t = getTranslations(lang).entry;

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
        <div style={STYLES.top}>
          <BackLink lang={lang} />
          <div style={STYLES.toggle} role="group" aria-label="Language">
            <button
              type="button"
              style={
                lang === "km"
                  ? { ...STYLES.toggleBtn, ...STYLES.toggleActive }
                  : STYLES.toggleBtn
              }
              onClick={() => setLang("km")}
            >
              KH
            </button>
            <button
              type="button"
              style={
                lang === "en"
                  ? { ...STYLES.toggleBtn, ...STYLES.toggleActive }
                  : STYLES.toggleBtn
              }
              onClick={() => setLang("en")}
            >
              EN
            </button>
          </div>
        </div>

        {status === "loading" ? (
          <p style={STYLES.status}>{t.loading}</p>
        ) : status === "notfound" || !entry ? (
          <p style={STYLES.status}>{t.notFound}</p>
        ) : (
          <>
            <EntryOwnerControls entryId={entry.id} isOwner={isOwner} lang={lang} />
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
