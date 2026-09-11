"use client";

import { useState } from "react";
import { archiveEntries } from "../src/data/entries.js";
import EntryCard from "../components/EntryCard.js";
import "./home.css";

// Khmer Unicode needs a font stack that includes Khmer-capable
// typefaces, otherwise the script falls back to tofu boxes or clips.
const FONT =
  "'Noto Sans Khmer', 'Leelawadee UI', 'Khmer OS Siemreap', 'Segoe UI', system-ui, sans-serif";

// All user-facing UI copy lives here so switching the header toggle
// also switches the hero, placeholders, result count and empty state.
const COPY = {
  km: {
    brand: "ពិធីបុណ្យប្រពៃណីខ្មែរ",
    heroTitle: "ពិធីបុណ្យប្រពៃណីជាតិនៃកម្ពុជា",
    heroSubtitle:
      "ស្វែងរក និងមើលពិធីបុណ្យប្រពៃណីខ្មែរ ដែលបានរក្សាទុកក្នុងបណ្ណសាររស់នេះ។",
    searchPlaceholder: "ស្វែងរកពិធីបុណ្យ ប្រភេទ ឬស្លាក…",
    count: (n) => `បានបង្ហាញ ${n} ពិធីបុណ្យ`,
    emptyTitle: "រកមិនឃើញពិធីបុណ្យ",
    emptyText: "សូមសាកល្បងពាក្យផ្សេង ឬចុចប៊ូតុងកំណត់ស្វែងរកឡើងវិញ។",
    reset: "កំណត់ស្វែងរកឡើងវិញ",
  },
  en: {
    brand: "Khmer Living Festivals",
    heroTitle: "Cambodia's Living Festivals",
    heroSubtitle:
      "Browse and search the Khmer festivals preserved in this living archive.",
    searchPlaceholder: "Search festivals, categories, or tags…",
    count: (n) => `${n} festival${n === 1 ? "" : "s"} shown`,
    emptyTitle: "No festivals found",
    emptyText: "Try a different keyword, or reset the search below.",
    reset: "Reset Search",
  },
};

// Featured photo used as the hero banner background (from /public).
const HERO_IMAGE =
  "url('/Khmer%20New%20Year%20(Choul%20Chnam%20Thmey).png')";

const STYLES = {
  main: {
    minHeight: "100vh",
    fontFamily: FONT,
    color: "#E8EDF2",
    backgroundColor: "#14181F",
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 32px",
    backgroundColor: "#0E1218",
    borderBottom: "1px solid #2E3644",
  },
  brand: {
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: 0.5,
    color: "#E8EDF2",
  },
  toggle: {
    display: "flex",
    gap: 6,
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 999,
    padding: 4,
  },
  toggleBtn: {
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: 600,
    padding: "6px 16px",
    borderRadius: 999,
    border: "none",
    backgroundColor: "transparent",
    color: "#97A1B3",
    cursor: "pointer",
  },
  toggleBtnActive: {
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: 800,
    padding: "6px 16px",
    borderRadius: 999,
    border: "none",
    backgroundColor: "#2EE6A8",
    color: "#14181F",
    cursor: "pointer",
  },
  hero: {
    position: "relative",
    textAlign: "center",
    padding: "88px 24px 72px",
    backgroundImage: `linear-gradient(rgba(14, 18, 24, 0.82), rgba(20, 24, 31, 0.94)), ${HERO_IMAGE}`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  heroInner: {
    maxWidth: 640,
    margin: "0 auto",
  },
  kicker: {
    fontFamily: "'Courier New', monospace",
    fontSize: 13,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#2EE6A8",
    margin: 0,
  },
  heroTitle: {
    fontSize: 44,
    fontWeight: 800,
    lineHeight: 1.15,
    margin: "12px 0 10px",
    color: "#E8EDF2",
  },
  heroSubtitle: {
    fontSize: 18,
    lineHeight: 1.6,
    color: "#B9C1CE",
    margin: "0 0 28px",
  },
  search: {
    display: "flex",
    justifyContent: "center",
  },
  searchInput: {
    width: "100%",
    maxWidth: 520,
    padding: "14px 44px 14px 20px",
    fontSize: 16,
    fontFamily: FONT,
    borderRadius: 999,
    border: "1px solid #3A4656",
    backgroundColor: "rgba(14, 18, 24, 0.85)",
    color: "#E8EDF2",
    outline: "none",
    boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
  },
  content: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "40px 24px 64px",
  },
  resultRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  resultCount: {
    fontFamily: "'Courier New', monospace",
    fontSize: 14,
    color: "#2EE6A8",
    margin: 0,
    letterSpacing: 0.5,
  },
  resetInline: {
    fontFamily: FONT,
    fontSize: 13,
    color: "#97A1B3",
    background: "none",
    border: "none",
    textDecoration: "underline",
    cursor: "pointer",
  },
  empty: {
    textAlign: "center",
    padding: "56px 24px",
    backgroundColor: "#1C222C",
    border: "1px dashed #3A4656",
    borderRadius: 14,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 700,
    margin: "0 0 8px",
    color: "#E8EDF2",
  },
  emptyText: {
    fontSize: 15,
    color: "#97A1B3",
    margin: "0 0 22px",
  },
  resetBtn: {
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: 600,
    padding: "10px 22px",
    borderRadius: 999,
    border: "1px solid #2EE6A8",
    backgroundColor: "transparent",
    color: "#2EE6A8",
    cursor: "pointer",
  },
  footer: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "24px 24px 48px",
    borderTop: "1px solid #2E3644",
    fontSize: 13,
    color: "#5A6373",
  },
};

const Home = () => {
  // Default language is Khmer; toggle switches km / en.
  const [lang, setLang] = useState("km");
  const [query, setQuery] = useState("");
  const t = COPY[lang];

  // Live, case-insensitive filter across Khmer + English titles,
  // the category, and all tags.
  const q = query.trim().toLowerCase();
  const results = archiveEntries.filter((entry) => {
    if (!q) return true;
    const haystack = [
      entry.titleKhmer,
      entry.titleEnglish,
      entry.category,
      ...entry.tags,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });

  return (
    <main style={STYLES.main} lang={lang}>
      {/* Header bar with brand + KM | EN toggle */}
      <header style={STYLES.header}>
        <span className="brand" style={STYLES.brand}>
          {t.brand}
        </span>
        <div style={STYLES.toggle} role="group" aria-label="Language">
          <button
            className="toggle-btn"
            style={lang === "km" ? STYLES.toggleBtnActive : STYLES.toggleBtn}
            onClick={() => setLang("km")}
          >
            <span className="short-label">KH</span>
            <span className="full-label">Khmer</span>
          </button>
          <button
            className="toggle-btn"
            style={lang === "en" ? STYLES.toggleBtnActive : STYLES.toggleBtn}
            onClick={() => setLang("en")}
          >
            <span className="short-label">EN</span>
            <span className="full-label">English</span>
          </button>
        </div>
      </header>

      {/* Hero banner */}
      <section style={STYLES.hero}>
        <div style={STYLES.heroInner}>
          <p style={STYLES.kicker}>
            {lang === "km" ? "បណ្ណសារខ្មែររស់" : "Khmer Living Archive"}
          </p>
          <h1 style={STYLES.heroTitle}>{t.heroTitle}</h1>
          <p style={STYLES.heroSubtitle}>{t.heroSubtitle}</p>
          <div style={STYLES.search}>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              style={STYLES.searchInput}
              aria-label={t.searchPlaceholder}
            />
          </div>
        </div>
      </section>

      {/* Results */}
      <div style={STYLES.content}>
        <div style={STYLES.resultRow}>
          <p style={STYLES.resultCount}>{t.count(results.length)}</p>
          {q && (
            <button style={STYLES.resetInline} onClick={() => setQuery("")}>
              {t.reset}
            </button>
          )}
        </div>

        {/* Card grid (responsive via home.css .card-grid) */}
        {results.length > 0 ? (
          <ul className="card-grid">
            {results.map((entry) => (
              <li key={entry.id} className="card-cell">
                <EntryCard entry={entry} lang={lang} />
              </li>
            ))}
          </ul>
        ) : (
          <div style={STYLES.empty}>
            <p style={STYLES.emptyTitle}>
              {lang === "en"
                ? "No festivals found"
                : "រកមិនឃើញពិធីបុណ្យ"}
            </p>
            <p style={STYLES.emptyText}>{t.emptyText}</p>
            <button style={STYLES.resetBtn} onClick={() => setQuery("")}>
              {t.reset}
            </button>
          </div>
        )}
      </div>

      <footer style={STYLES.footer}>
        Built in ICT 340 — Vibe Coding, American University of Phnom Penh,
        Fall 2026.
      </footer>
    </main>
  );
};

export default Home;


