"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client.js";
import { getTranslations } from "../../lib/i18n";
import { useLanguage } from "../../lib/i18n/LanguageProvider";
import { FONT } from "../../lib/styles/fonts";
import BackLink from "../../components/BackLink";
import Spinner from "../../components/Spinner";

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
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
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
  const router = useRouter();
  const { lang } = useLanguage();
  const t = getTranslations(lang).login;
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    setError(null);
    setPending(true);
    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError(t.errorInvalid);
        return;
      }
      router.push("/");
      router.refresh();
    } catch (unexpected) {
      console.error("Sign-in failed:", unexpected);
      setError(t.errorGeneric);
    } finally {
      setPending(false);
    }
  };

  return (
    <main style={STYLES.main} lang={lang}>
      <div style={STYLES.card}>
        <h1 style={STYLES.title}>{t.title}</h1>
        <p style={STYLES.subtitle}>{t.subtitle}</p>
        <form onSubmit={handleSubmit}>
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
          {error && <p style={STYLES.error}>{error}</p>}
          <button
            type="submit"
            disabled={pending}
            style={
              pending
                ? { ...STYLES.button, ...STYLES.buttonDisabled }
                : STYLES.button
            }
          >
            {pending ? <Spinner /> : null}
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
