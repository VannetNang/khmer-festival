"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import BackLink from "../../../../components/BackLink.js";
import EditEntryForm from "../../../../components/EditEntryForm.js";
import { createClient } from "../../../../lib/supabase/client.js";
import { getTranslations } from "../../../../lib/i18n/index.js";
import "../../../contribute/contribute.css";

// Edit page: same shared form as /contribute, pre-filled with the entry.
// Only the owner is allowed to edit; anyone else is told they cannot.
export default function EditEntryPage() {
  const { id } = useParams();
  const [lang, setLang] = useState("km");
  const [status, setStatus] = useState("loading");
  const [entry, setEntry] = useState(null);
  const t = getTranslations(lang).contribute;
  const te = getTranslations(lang).entry;

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    Promise.all([
      supabase.from("archive_entries").select("*").eq("id", id).single(),
      supabase.auth.getUser(),
    ]).then(([entryRes, userRes]) => {
      if (!mounted) return;

      if (entryRes.error || !entryRes.data) {
        if (entryRes.error) {
          console.error("Loading entry failed:", entryRes.error.message);
        }
        setStatus("notfound");
        return;
      }

      const user = userRes.data?.user;
      if (!user) {
        setStatus("anon");
        return;
      }
      if (user.id !== entryRes.data.owner) {
        setStatus("forbidden");
        return;
      }

      setEntry(entryRes.data);
      setStatus("ready");
    });

    return () => {
      mounted = false;
    };
  }, [id]);

  return (
    <main className="contribute-page" lang={lang}>
      <div className="contribute-card">
        <div className="contribute-top">
          <BackLink lang={lang} href={`/entry/${id}`} />
          <div className="toggle" role="group" aria-label="Language">
            <button
              type="button"
              className={lang === "km" ? "toggle-btn toggle-active" : "toggle-btn"}
              onClick={() => setLang("km")}
            >
              KH
            </button>
            <button
              type="button"
              className={lang === "en" ? "toggle-btn toggle-active" : "toggle-btn"}
              onClick={() => setLang("en")}
            >
              EN
            </button>
          </div>
        </div>

        <h1 className="c-title">{te.editTitle}</h1>
        <p className="c-subtitle">{te.editSubtitle}</p>

        {status === "loading" ? (
          <p className="c-prompt">{te.loading}</p>
        ) : status === "anon" ? (
          <p className="c-prompt">
            {t.loginPrompt}{" "}
            <Link href="/login" className="c-link">
              {t.loginLink}
            </Link>
          </p>
        ) : status === "forbidden" ? (
          <p className="c-prompt">{te.forbidden}</p>
        ) : status === "notfound" ? (
          <p className="c-prompt">{te.notFound}</p>
        ) : (
          <EditEntryForm lang={lang} entry={entry} />
        )}
      </div>
    </main>
  );
}
