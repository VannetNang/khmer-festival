"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup } from "./actions";

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

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signup, { error: null });

  return (
    <main style={STYLES.main}>
      <div style={STYLES.card}>
        <h1 style={STYLES.title}>Create an account</h1>
        <p style={STYLES.subtitle}>Join the archive as a contributor.</p>
        <form action={formAction}>
          <label style={STYLES.field}>
            <span style={STYLES.label}>Email</span>
            <input type="email" name="email" required style={STYLES.input} />
          </label>
          <label style={STYLES.field}>
            <span style={STYLES.label}>Password</span>
            <input
              type="password"
              name="password"
              required
              minLength={6}
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
            {pending ? "Creating account…" : "Create account"}
          </button>
        </form>
        <p style={STYLES.muted}>
          Already have an account?{" "}
          <Link href="/login" style={STYLES.link}>
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
