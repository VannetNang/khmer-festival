"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { archiveEntries } from "../data/entries.js";
import EntryCard from "../components/EntryCard.js";
import { createClient } from "../lib/supabase/client.js";
import { getTranslations } from "../lib/i18n/index.js";
import "./home.css";

const FONT =
  "'Kantumruy Pro', 'Inter', 'Noto Sans Khmer', system-ui, -apple-system, sans-serif";

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
    color: "#E8EDF2",
    backgroundColor: "#14181F",
    width: "100%",
    maxWidth: "100vw",
    boxSizing: "border-box",
    overflowX: "hidden",
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    height: 64,
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    backgroundColor: "#0E1218",
    borderBottom: "1px solid #2E3644",
    width: "100%",
  },
  brand: {
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: 0.5,
    color: "#E8EDF2",
    lineHeight: "24px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  auth: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexShrink: 0,
  },
  userEmail: {
    fontSize: 13,
    color: "#97A1B3",
    maxWidth: "min(120px, 22vw)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  authLink: {
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: 600,
    color: "#14181F",
    backgroundColor: "#2EE6A8",
    padding: "6px 14px",
    borderRadius: 999,
    textDecoration: "none",
  },
  logoutBtn: {
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: 600,
    color: "#E8EDF2",
    backgroundColor: "transparent",
    border: "1px solid #2E3644",
    padding: "6px 14px",
    borderRadius: 999,
    cursor: "pointer",
  },
  toggle: {
    display: "flex",
    gap: 4,
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 999,
    padding: 3,
    alignItems: "center",
    flexShrink: 0,
  },
  toggleBtn: {
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: 600,
    height: 32,
    padding: "0 14px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    border: "none",
    backgroundColor: "transparent",
    color: "#97A1B3",
    cursor: "pointer",
    boxSizing: "border-box",
  },
  toggleBtnActive: {
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: 700,
    height: 32,
    padding: "0 14px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    border: "none",
    backgroundColor: "#2EE6A8",
    color: "#14181F",
    cursor: "pointer",
    boxSizing: "border-box",
  },
  hero: {
    position: "relative",
    width: "100%",
    boxSizing: "border-box",
    textAlign: "center",
    padding: "60px 16px 48px",
    backgroundImage: `linear-gradient(rgba(14, 18, 24, 0.82), rgba(20, 24, 31, 0.94)), ${HERO_IMAGE}`,
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
    fontFamily: "'Courier New', monospace",
    fontSize: 13,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#2EE6A8",
    margin: "0 0 8px 0",
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 700,
    lineHeight: 1.3,
    margin: "0 0 12px 0",
    color: "#E8EDF2",
  },
  heroSubtitle: {
    fontSize: 15,
    lineHeight: 1.6,
    color: "#B9C1CE",
    margin: "0 0 24px 0",
  },
  search: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  searchInput: {
    width: "100%",
    maxWidth: 520,
    padding: "12px 20px",
    fontSize: 15,
    fontFamily: FONT,
    borderRadius: 999,
    border: "1px solid #3A4656",
    backgroundColor: "rgba(14, 18, 24, 0.85)",
    color: "#E8EDF2",
    outline: "none",
    boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
    boxSizing: "border-box",
  },
  content: {
    maxWidth: 1100,
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
    marginBottom: 20,
    minHeight: 24,
    width: "100%",
    boxSizing: "border-box",
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
    width: "100%",
    textAlign: "center",
    padding: "48px 20px",
    backgroundColor: "#1C222C",
    border: "1px dashed #3A4656",
    borderRadius: 14,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 700,
    margin: "0 0 8px",
    color: "#E8EDF2",
  },
  emptyText: {
    fontSize: 14,
    color: "#97A1B3",
    margin: "0 0 20px",
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
    width: "100%",
    margin: "0 auto",
    padding: "24px 16px 48px",
    borderTop: "1px solid #2E3644",
    fontSize: 13,
    color: "#5A6373",
    boxSizing: "border-box",
  },
};

const Home = () => {
  const [lang, setLang] = useState("km");
  const [query, setQuery] = useState("");
  const [userEmail, setUserEmail] = useState(null);
  const t = getTranslations(lang).home;

  // Track the signed-in user through the browser Supabase client so the
  // header can show their email + a logout button (or login/signup links).
  useEffect(() => {
    let mounted = true;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (mounted && data?.user?.email) setUserEmail(data.user.email);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await createClient().auth.signOut();
  };

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
        {userEmail ? (
          <div style={STYLES.auth}>
            <span style={STYLES.userEmail}>{userEmail}</span>
            <button style={STYLES.logoutBtn} onClick={handleLogout}>
              {t.logoutTitle}
            </button>
          </div>
        ) : (
          <div style={STYLES.auth}>
            <Link href="/login" style={STYLES.authLink}>
              {t.loginTitle}
            </Link>
            <Link href="/signup" style={STYLES.authLink}>
              {t.signUpTitle}
            </Link>
          </div>
        )}
      </header>

      <section style={STYLES.hero}>
        <div style={STYLES.heroInner}>
          <p style={STYLES.kicker}>{t.kicker}</p>
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

      <div style={STYLES.content}>
        <div style={STYLES.resultRow}>
          <p style={STYLES.resultCount}>{t.count(results.length)}</p>
          {q && (
            <button style={STYLES.resetInline} onClick={() => setQuery("")}>
              {t.reset}
            </button>
          )}
        </div>

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
            <p style={STYLES.emptyTitle}>{t.emptyTitle}</p>
            <p style={STYLES.emptyText}>{t.emptyText}</p>
            <button style={STYLES.resetBtn} onClick={() => setQuery("")}>
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
