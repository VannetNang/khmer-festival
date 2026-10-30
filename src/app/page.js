"use client";

import { useEffect, useState } from "react";
import EntryCard from "../components/EntryCard.js";
import SearchInput from "../components/SearchInput.js";
import { createClient } from "../lib/supabase/client.js";
import { getTranslations } from "../lib/i18n/index.js";
import { useLanguage } from "../lib/i18n/LanguageProvider.js";
import { FONT } from "../lib/styles/fonts.js";
import { toCardEntry } from "../lib/entries/toCardEntry.js";
import "./home.css";

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
    brand: "Khmer Festivals",
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

const HERO_IMAGE = "url('/assets/images/khmer_new_year.png')";

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
  hero: {
    position: "relative",
    width: "100%",
    boxSizing: "border-box",
    textAlign: "center",
    minHeight: 380,
    padding: "clamp(80px, 16vw, 140px) 16px clamp(60px, 12vw, 110px)",
    backgroundImage: `linear-gradient(var(--hero-overlay-top), var(--hero-overlay-bottom)), ${HERO_IMAGE}`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  heroInner: {
    maxWidth: 640,
    width: "100%",
    margin: "0 auto",
    boxSizing: "border-box",
  },
  kicker: {
    fontFamily: FONT,
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: 2,
    textTransform: "uppercase",
    margin: "0 0 8px 0",
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 700,
    lineHeight: 1.3,
    margin: "0 0 12px 0",
  },
  heroSubtitle: {
    fontSize: 15,
    lineHeight: 1.6,
    color: "var(--hero-text-muted)",
    margin: "0 0 24px 0",
  },
  content: {
    maxWidth: 1400,
    width: "100%",
    margin: "0 auto",
    padding: "32px 16px 64px",
    boxSizing: "border-box",
    minHeight: "400px",
    display: "flex",
    flexDirection: "column",
  },
  resultRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 20,
    minHeight: 24,
    width: "100%",
    boxSizing: "border-box",
  },
  rowRight: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  resultCount: {
    fontFamily: "'Courier New', monospace",
    fontSize: 14,
    margin: 0,
    letterSpacing: 0.5,
    fontWeight: 700
  },
  sort: {
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: 600,
    color: "var(--text)",
    backgroundColor: "var(--surface)",
    border: "1px solid var(--border-strong)",
    borderRadius: 999,
    padding: "8px 14px",
    cursor: "pointer",
  },
  resetInline: {
    fontFamily: FONT,
    fontSize: 13,
    color: "var(--text-dim)",
    background: "none",
    border: "none",
    textDecoration: "underline",
    cursor: "pointer",
  },
  empty: {
    width: "100%",
    textAlign: "center",
    padding: "48px 20px",
    backgroundColor: "var(--surface)",
    border: "1px dashed var(--border-strong)",
    borderRadius: 14,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 700,
    margin: "0 0 8px",
    color: "var(--text)",
  },
  emptyText: {
    fontSize: 14,
    color: "var(--text-dim)",
    margin: "0 0 20px",
  },
  resetBtn: {
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: 600,
    padding: "10px 22px",
    borderRadius: 999,
    border: "1px solid var(--accent-text)",
    backgroundColor: "transparent",
    color: "var(--accent-text)",
    cursor: "pointer",
  },
  footer: {
    maxWidth: 1400,
    width: "100%",
    margin: "0 auto",
    padding: "24px 16px 48px",
    borderTop: "1px solid var(--border)",
    fontSize: 13,
    color: "var(--text-faint)",
    boxSizing: "border-box",
  },
};

const Home = () => {
  const { lang } = useLanguage();
  const [query, setQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  // Queue-style sort for the public feed; oldest first is the default.
  const [sortOrder, setSortOrder] = useState("oldest");
  const t = getTranslations(lang).home;

  // Read every published entry from the archive table, oldest first (the feed's
  // default order; the sort dropdown re-orders the list client side). The select
  // policy is open to anon + authenticated, so this works signed out too; the
  // explicit status filter keeps pending/returned drafts out of the public feed.
  useEffect(() => {
    let mounted = true;
    createClient()
      .from("archive_entries")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (!mounted) return;
        if (error) {
          console.error("Could not load archive entries:", error.message);
          setLoadFailed(true);
        } else {
          setEntries((data ?? []).map(toCardEntry));
        }
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const q = query.trim().toLowerCase();
  // Sort a copy (state arrays are never mutated) by submitted date, then apply
  // the search on top so the result list follows the dropdown immediately.
  const sorted = [...entries].sort((a, b) => {
    const diff = new Date(a.createdAt) - new Date(b.createdAt);
    return sortOrder === "oldest" ? diff : -diff;
  });
  const results = sorted.filter((entry) => {
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

  // Clears both the committed search term and the text still sitting in the
  // input, so the hero box and the results stay in step.
  const resetSearch = () => {
    setQuery("");
    setInputValue("");
  };

  return (
    <main style={STYLES.main} lang={lang}>
      <section style={STYLES.hero}>
        <div style={STYLES.heroInner}>
          <p style={STYLES.kicker}>{t.kicker}</p>
          <h1 style={STYLES.heroTitle}>{t.heroTitle}</h1>
          <p style={STYLES.heroSubtitle}>{t.heroSubtitle}</p>
          <SearchInput
            value={inputValue}
            placeholder={t.searchPlaceholder}
            onChange={setInputValue}
            onSearch={setQuery}
          />
        </div>
      </section>

      <div style={STYLES.content}>
        <div style={STYLES.resultRow}>
          <p style={STYLES.resultCount}>
            {loading ? t.loading : t.count(results.length)}
          </p>
          <div style={STYLES.rowRight}>
            {q && (
              <button style={STYLES.resetInline} onClick={resetSearch}>
                {t.reset}
              </button>
            )}
            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              style={STYLES.sort}
              aria-label={t.sortOldest}
            >
              <option value="oldest">{t.sortOldest}</option>
              <option value="newest">{t.sortNewest}</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={STYLES.empty}>
            <p style={STYLES.emptyTitle}>{t.loading}</p>
            <p style={STYLES.emptyText}>{t.loadingText}</p>
          </div>
        ) : loadFailed ? (
          <div style={STYLES.empty}>
            <p style={STYLES.emptyTitle}>{t.loadFailedTitle}</p>
            <p style={STYLES.emptyText}>{t.loadFailedText}</p>
          </div>
        ) : results.length > 0 ? (
          <ul className="card-grid">
            {results.map((entry) => (
              <li key={entry.id} className="card-cell">
                <EntryCard entry={entry} lang={lang} from="home" />
              </li>
            ))}
          </ul>
        ) : (
          <div style={STYLES.empty}>
            <p style={STYLES.emptyTitle}>{t.emptyTitle}</p>
            <p style={STYLES.emptyText}>{t.emptyText}</p>
            <button style={STYLES.resetBtn} onClick={resetSearch}>
              {t.reset}
            </button>
          </div>
        )}
      </div>

      <footer style={STYLES.footer}>
        Built in ICT 340 — Vibe Coding, American University of Phnom Penh, Fall
        2026.
      </footer>
    </main>
  );
};

export default Home;
