"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { login } from "./actions";
import { getTranslations } from "../../lib/i18n";
import BackLink from "../../components/BackLink";

// Visual style mirrors the home page: dark theme, inline style objects,
// and the same brand colors.
const FONT =
  "'Kantumruy Pro', 'Inter', 'Noto Sans Khmer', system-ui, -apple-system, sans-serif";

const STYLES = {
  main: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    backgroundColor: "#14181F",
    color: "#E8EDF2",
    fontFamily: FONT,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 16,
    padding: "32px",
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  toggle: {
    display: "flex",
    gap: 4,
    backgroundColor: "#14181F",
    border: "1px solid #2E3644",
    borderRadius: 999,
    padding: 3,
    alignItems: "center",
    width: "fit-content",
  },
  toggleBtn: {
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: 600,
    height: 30,
    padding: "0 14px",
    borderRadius: 999,
    border: "none",
    backgroundColor: "transparent",
    color: "#97A1B3",
    cursor: "pointer",
  },
  toggleBtnActive: {
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: 700,
    height: 30,
    padding: "0 14px",
    borderRadius: 999,
    border: "none",
    backgroundColor: "#2EE6A8",
    color: "#14181F",
    cursor: "pointer",
  },
  title: { fontSize: 26, fontWeight: 700, margin: "0 0 6px", color: "#E8EDF2" },
  subtitle: { fontSize: 14, color: "#97A1B3", margin: "0 0 24px" },
  field: { display: "block", marginBottom: 16 },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#B9C1CE",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    fontSize: 16,
    fontFamily: FONT,
    borderRadius: 10,
    border: "1px solid #3A4656",
    backgroundColor: "#14181F",
    color: "#E8EDF2",
    outline: "none",
  },
  error: {
    margin: "0 0 16px",
    fontSize: 14,
    color: "#FF5C5C",
    backgroundColor: "rgba(255,92,92,0.12)",
    border: "1px solid rgba(255,92,92,0.4)",
    borderRadius: 10,
    padding: "10px 12px",
  },
  button: {
    width: "100%",
    padding: "12px 14px",
    fontSize: 16,
    fontWeight: 700,
    fontFamily: FONT,
    color: "#14181F",
    backgroundColor: "#2EE6A8",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    marginTop: 4,
  },
  buttonDisabled: { opacity: 0.6, cursor: "not-allowed" },
  muted: {
    fontSize: 14,
    color: "#97A1B3",
    textAlign: "center",
    margin: "18px 0 0",
  },
  link: { color: "#2EE6A8", textDecoration: "none", fontWeight: 600 },
};

export default function LoginPage() {
  const [lang, setLang] = useState("km");
  const [state, formAction, pending] = useActionState(login, { error: null });
  const t = getTranslations(lang).login;

  return (
    <main style={STYLES.main} lang={lang}>
      <div style={STYLES.card}>
        <div style={STYLES.topRow}>
          <BackLink lang={lang} />
          <div style={STYLES.toggle} role="group" aria-label="Language">
            <button
              style={lang === "km" ? STYLES.toggleBtnActive : STYLES.toggleBtn}
              onClick={() => setLang("km")}
              type="button"
            >
              KH
            </button>
            <button
              style={lang === "en" ? STYLES.toggleBtnActive : STYLES.toggleBtn}
              onClick={() => setLang("en")}
              type="button"
            >
              EN
            </button>
          </div>
        </div>
        <h1 style={STYLES.title}>{t.title}</h1>
        <p style={STYLES.subtitle}>{t.subtitle}</p>
        <form action={formAction}>
          <label style={STYLES.field}>
            <span style={STYLES.label}>{t.emailLabel}</span>
            <input type="email" name="email" required style={STYLES.input} />
          </label>
          <label style={STYLES.field}>
            <span style={STYLES.label}>{t.passwordLabel}</span>
            <input
              type="password"
              name="password"
              required
              style={STYLES.input}
            />
          </label>
          {state.error && <p style={STYLES.error}>{state.error}</p>}
          <button
            type="submit"
            disabled={pending}
            style={
              pending
                ? { ...STYLES.button, ...STYLES.buttonDisabled }
                : STYLES.button
            }
          >
            {pending ? t.submitting : t.submit}
          </button>
        </form>
        <p style={STYLES.muted}>
          {t.noAccount}{" "}
          <Link href="/signup" style={STYLES.link}>
            {t.signupLink}
          </Link>
        </p>
      </div>
    </main>
  );
}
