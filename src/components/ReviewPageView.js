"use client";

import { useLanguage } from "../lib/i18n/LanguageProvider.js";
import { getTranslations } from "../lib/i18n/index.js";
import { FONT } from "../lib/styles/fonts.js";
import ReviewQueue from "./ReviewQueue.js";

// The visible half of /review. The Server Component page runs the is_reviewer
// gate and the pending-entry query, then hands the result to this component so
// the whole screen — permission message included — switches with the UI
// language, exactly like every other page in the app.
const STYLES = {
  main: {
    minHeight: "100vh",
    fontFamily: FONT,
    color: "var(--text)",
    backgroundColor: "var(--bg)",
    width: "100%",
    boxSizing: "border-box",
  },
  center: {
    maxWidth: 640,
    width: "100%",
    margin: "0 auto",
    padding: "80px 16px",
    boxSizing: "border-box",
  },
  permission: {
    fontSize: 16,
    lineHeight: 1.7,
    textAlign: "center",
    color: "var(--text-dim)",
    backgroundColor: "var(--surface)",
    border: "1px dashed var(--border-strong)",
    borderRadius: 14,
    padding: "32px 20px",
    margin: 0,
  },
  content: {
    maxWidth: 1000,
    width: "100%",
    margin: "0 auto",
    padding: "40px 16px 64px",
    boxSizing: "border-box",
    minHeight: "400px",
  },
  heading: { fontSize: 28, fontWeight: 700, margin: "0 0 6px", color: "var(--text)" },
  subtitle: { fontSize: 15, color: "var(--text-dim)", margin: "0 0 28px" },
  loadFailed: {
    fontSize: 14,
    color: "var(--danger)",
    backgroundColor: "var(--danger-soft)",
    border: "1px solid var(--danger-border)",
    borderRadius: 10,
    padding: "12px 16px",
    margin: 0,
  },
};

const ReviewPageView = ({ reviewer, initialEntries, loadFailed }) => {
  const { lang } = useLanguage();
  const t = getTranslations(lang).review;

  if (!reviewer) {
    // Only the permission message — a non-reviewer is never given any entries.
    return (
      <main style={STYLES.main} lang={lang}>
        <div style={STYLES.center}>
          <p style={STYLES.permission}>{t.permission}</p>
        </div>
      </main>
    );
  }

  return (
    <main style={STYLES.main} lang={lang}>
      <div style={STYLES.content}>
        <h1 style={STYLES.heading}>{t.title}</h1>
        <p style={STYLES.subtitle}>{t.subtitle}</p>
        {loadFailed ? (
          <p style={STYLES.loadFailed}>{t.loadFailed}</p>
        ) : (
          <ReviewQueue initialEntries={initialEntries} />
        )}
      </div>
    </main>
  );
};

export default ReviewPageView;
