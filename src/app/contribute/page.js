"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client.js";
import { getTranslations } from "../../lib/i18n/index.js";
import { useLanguage } from "../../lib/i18n/LanguageProvider.js";
import BackLink from "../../components/BackLink.js";
import ContributeForm from "../../components/ContributeForm.js";
import "./contribute.css";

// Auth gate: only a signed-in contributor sees the form. We check the session
// with the browser Supabase client (supabase.auth.getUser) before rendering.
export default function ContributePage() {
  const { lang } = useLanguage();
  const [status, setStatus] = useState("checking");
  const t = getTranslations(lang).contribute;

  useEffect(() => {
    let mounted = true;
    createClient()
      .auth.getUser()
      .then(({ data }) => {
        if (mounted) setStatus(data?.user ? "authed" : "anon");
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="contribute-page" lang={lang}>
      <div className="contribute-card">
        <h1 className="c-title">{t.title}</h1>
        <p className="c-subtitle">{t.subtitle}</p>

        {status === "checking" ? (
          <p className="c-prompt">{t.checking}</p>
        ) : status === "anon" ? (
          <p className="c-prompt">
            {t.loginPrompt}{" "}
            <Link href="/login" className="c-link">
              {t.loginLink}
            </Link>
          </p>
        ) : (
          <ContributeForm lang={lang} />
        )}
      </div>
    </main>
  );
}
