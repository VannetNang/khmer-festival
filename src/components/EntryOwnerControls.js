"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client.js";
import { deleteArchiveEntry } from "../lib/supabase/deleteArchiveEntry.js";
import { getTranslations } from "../lib/i18n/index.js";

const FONT =
  "'Kantumruy Pro', 'Inter', 'Noto Sans Khmer', system-ui, -apple-system, sans-serif";

const STYLES = {
  row: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  edit: {
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: 600,
    color: "#14181F",
    backgroundColor: "#2EE6A8",
    padding: "8px 18px",
    borderRadius: 999,
    textDecoration: "none",
  },
  delete: {
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: 600,
    color: "#FF5C5C",
    backgroundColor: "transparent",
    border: "1px solid rgba(255,92,92,0.5)",
    padding: "8px 18px",
    borderRadius: 999,
    cursor: "pointer",
  },
  deleteDisabled: { opacity: 0.6, cursor: "not-allowed" },
  message: {
    fontFamily: FONT,
    fontSize: 14,
    color: "#FF5C5C",
    margin: 0,
  },
};

// Shows Edit and Delete only to the entry's owner. Delete asks for
// confirmation, then removes the row and checks that a row actually came back.
const EntryOwnerControls = ({ entryId, isOwner, lang, onDeleted }) => {
  const router = useRouter();
  const t = getTranslations(lang).entry;
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState(null);

  if (!isOwner) return null;

  const handleDelete = async () => {
    if (!window.confirm(t.deleteConfirm)) return;

    setMessage(null);
    setDeleting(true);

    try {
      const result = await deleteArchiveEntry(createClient(), entryId);
      if (result.error) {
        setMessage(t.changeNotSaved);
        return;
      }
      if (onDeleted) {
        onDeleted(entryId);
      } else {
        router.push("/");
      }
    } catch (unexpected) {
      console.error("Unexpected error while deleting entry:", unexpected);
      setMessage(t.changeNotSaved);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={STYLES.row}>
      <Link href={`/entry/${entryId}/edit`} style={STYLES.edit}>
        {t.edit}
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        style={deleting ? { ...STYLES.delete, ...STYLES.deleteDisabled } : STYLES.delete}
      >
        {deleting ? t.deleting : t.delete}
      </button>
      {message ? (
        <p style={STYLES.message} role="alert">
          {message}
        </p>
      ) : null}
    </div>
  );
};

export default EntryOwnerControls;
