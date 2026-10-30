"use client";

import { useEffect } from "react";
import { FONT } from "../lib/styles/fonts.js";

// Full detail view opened by "Explore More" on a review card. Shows the entry
// the way the site will eventually present it — large photo, category, both
// titles, both full descriptions, source credit and submitted date — and
// repeats the Publish / Return actions so the reviewer can decide right here.
const STYLES = {
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 60,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "32px 16px",
    overflowY: "auto",
    boxSizing: "border-box",
  },
  dialog: {
    width: "100%",
    maxWidth: 720,
    backgroundColor: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 24px 64px rgba(0, 0, 0, 0.45)",
  },
  image: {
    width: "100%",
    aspectRatio: "16 / 9",
    objectFit: "cover",
    display: "block",
    backgroundColor: "var(--bg)",
  },
  body: { padding: "24px 26px 26px" },
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
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 1.4,
    color: "var(--text)",
    margin: "10px 0 2px",
  },
  titleEnglish: {
    fontSize: 17,
    fontWeight: 600,
    color: "var(--text-muted)",
    margin: "0 0 14px",
  },
  meta: { fontSize: 13, color: "var(--season)", margin: "0 0 20px" },
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
    fontSize: 15,
    lineHeight: 1.7,
    color: "var(--text)",
    margin: 0,
    whiteSpace: "pre-line",
    overflowWrap: "anywhere",
    wordBreak: "break-word",
  },
  descriptionEn: {
    fontSize: 15,
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
    paddingTop: 16,
    margin: 0,
    overflowWrap: "anywhere",
    wordBreak: "break-word",
  },
  actions: { display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20 },
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
  close: {
    flex: 1,
    minWidth: 140,
    fontSize: 14,
    fontWeight: 600,
    color: "var(--text-muted)",
    backgroundColor: "transparent",
    border: "1px solid var(--border-strong)",
    padding: "10px 18px",
    borderRadius: 999,
    cursor: "pointer",
  },
  disabled: { opacity: 0.6, cursor: "not-allowed" },
};

const ReviewDetailDialog = ({ entry, busy, t, onPublish, onReturn, onClose }) => {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape" && !busy) onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [busy, onClose]);

  const src = entry.image_path.replace(/ /g, "%20");
  const submitted = new Date(entry.created_at).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      style={STYLES.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label={entry.title_english}
      onClick={busy ? undefined : onClose}
    >
      <div style={STYLES.dialog} onClick={(event) => event.stopPropagation()}>
        <img src={src} alt={entry.title_english} style={STYLES.image} />
        <div style={STYLES.body}>
          <p style={STYLES.category}>{entry.category}</p>
          <h2 style={STYLES.titleKhmer} lang="km">
            {entry.title_khmer}
          </h2>
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
              onClick={() => onPublish(entry.id)}
            >
              {busy ? "…" : t.publish}
            </button>
            <button
              type="button"
              style={busy ? { ...STYLES.return, ...STYLES.disabled } : STYLES.return}
              disabled={busy}
              onClick={() => onReturn(entry.id)}
            >
              {busy ? "…" : t.return}
            </button>
            <button
              type="button"
              style={busy ? { ...STYLES.close, ...STYLES.disabled } : STYLES.close}
              disabled={busy}
              onClick={onClose}
            >
              {t.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailDialog;
