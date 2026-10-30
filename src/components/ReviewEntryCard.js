"use client";

import { getTranslations } from "../lib/i18n/index.js";
import { useLanguage } from "../lib/i18n/LanguageProvider.js";
import { FONT } from "../lib/styles/fonts.js";

// One pending entry in the review queue. Shows everything a reviewer needs to
// judge a contribution in both languages — titles, photo, both descriptions,
// the source credit and the submitted date — followed by the two decision
// buttons, which simply forward to ReviewQueue's review_entry RPC handler.

const STYLES = {
  card: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    overflow: "hidden",
    width: "100%",
  },
  image: {
    width: "100%",
    aspectRatio: "16 / 9",
    objectFit: "cover",
    display: "block",
    backgroundColor: "var(--bg)",
  },
  body: { padding: "20px 22px 22px" },
  category: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "var(--accent-text)",
    margin: 0,
  },
  titleKhmer: {
    fontFamily: "Kantumruy Pro, sans-serif",
    fontSize: 22,
    fontWeight: 700,
    lineHeight: 1.4,
    color: "var(--text)",
    margin: "8px 0 2px",
  },
  titleEnglish: {
    fontSize: 16,
    fontWeight: 600,
    color: "var(--text-muted)",
    margin: "0 0 12px",
  },
  meta: { fontSize: 13, color: "var(--season)", margin: "0 0 16px" },
  section: { marginBottom: 16 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "var(--text-dim)",
    margin: "0 0 6px",
  },
  description: {
    fontSize: 14,
    lineHeight: 1.7,
    color: "var(--text)",
    margin: 0,
    whiteSpace: "pre-line",
    // Khmer/English text with no spaces must wrap inside the card.
    overflowWrap: "anywhere",
    wordBreak: "break-word",
  },
  descriptionEn: {
    fontSize: 14,
    lineHeight: 1.7,
    color: "var(--text-muted)",
    margin: 0,
    whiteSpace: "pre-line",
    overflowWrap: "anywhere",
    wordBreak: "break-word",
  },
  source: {
    fontSize: 13,
    lineHeight: 1.6,
    color: "var(--text-muted)",
    borderTop: "1px solid var(--border)",
    paddingTop: 14,
    margin: 0,
    overflowWrap: "anywhere",
    wordBreak: "break-word",
  },
  actions: { display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18 },
  publish: {
    flex: 1,
    minWidth: 150,
    fontSize: 14,
    fontWeight: 600,
    color: "var(--accent-contrast)",
    backgroundColor: "var(--accent)",
    border: "1px solid transparent",
    padding: "10px 18px",
    borderRadius: 999,
    cursor: "pointer",
  },
  return: {
    flex: 1,
    minWidth: 150,
    fontSize: 14,
    fontWeight: 600,
    color: "var(--danger)",
    backgroundColor: "transparent",
    border: "1px solid var(--danger-border-strong)",
    padding: "10px 18px",
    borderRadius: 999,
    cursor: "pointer",
  },
  disabled: { opacity: 0.6, cursor: "not-allowed" },
};

const ReviewEntryCard = ({ entry, busy, onDecide }) => {
  const { lang } = useLanguage();
  const t = getTranslations(lang).review;
  // Stored image paths can contain spaces; encode them like EntryCard does so
  // the browser can resolve the URL.
  const src = entry.image_path.replace(/ /g, "%20");
  const submitted = new Date(entry.created_at).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <article style={STYLES.card}>
      <img src={src} alt={entry.title_english} style={STYLES.image} loading="lazy" />
      <div style={STYLES.body}>
        <p style={STYLES.category}>{entry.category}</p>
        <h3 style={STYLES.titleKhmer} lang="km">
          {entry.title_khmer}
        </h3>
        <p style={STYLES.titleEnglish}>{entry.title_english}</p>
        <p style={STYLES.meta}>
          {t.submitted} {submitted}
        </p>

        <div style={STYLES.section}>
          <p style={STYLES.sectionLabel}>{t.khmer}</p>
          <p style={STYLES.description} lang="km">
            {entry.description_khmer}
          </p>
        </div>

        <div style={STYLES.section}>
          <p style={STYLES.sectionLabel}>{t.english}</p>
          <p style={STYLES.descriptionEn}>{entry.description_english}</p>
        </div>

        <p style={STYLES.source}>
          {t.source} {entry.source}
        </p>

        <div style={STYLES.actions}>
          <button
            type="button"
            style={busy ? { ...STYLES.publish, ...STYLES.disabled } : STYLES.publish}
            disabled={busy}
            onClick={() => onDecide(entry.id, "published")}
          >
            {busy ? "…" : t.publish}
          </button>
          <button
            type="button"
            style={busy ? { ...STYLES.return, ...STYLES.disabled } : STYLES.return}
            disabled={busy}
            onClick={() => onDecide(entry.id, "returned")}
          >
            {busy ? "…" : t.return}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ReviewEntryCard;
