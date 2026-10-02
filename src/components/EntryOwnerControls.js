"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client.js";
import { deleteArchiveEntry } from "../lib/supabase/deleteArchiveEntry.js";
import { getTranslations } from "../lib/i18n/index.js";
import { FONT } from "../lib/styles/fonts.js";
import ConfirmDialog from "./ConfirmDialog.js";

const STYLES = {
  row: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  rowInline: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "flex-end",
  },
  edit: {
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: 600,
    color: "var(--accent-contrast)",
    backgroundColor: "var(--accent)",
    padding: "8px 18px",
    borderRadius: 999,
    textDecoration: "none",
  },
  delete: {
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: 600,
    color: "var(--danger)",
    backgroundColor: "transparent",
    border: "1px solid var(--danger-border-strong)",
    padding: "8px 18px",
    borderRadius: 999,
    cursor: "pointer",
  },
  deleteDisabled: { opacity: 0.6, cursor: "not-allowed" },
  message: {
    fontFamily: FONT,
    fontSize: 14,
    color: "var(--danger)",
    margin: 0,
  },
};

// Shows Edit and Delete only to the entry's owner. Delete asks for
// confirmation, then removes the row and checks that a row actually came back.
const EntryOwnerControls = ({ entryId, entryTitle, isOwner, lang, onDeleted, inline = false }) => {
  const router = useRouter();
  const t = getTranslations(lang).entry;
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!isOwner) return null;

  const trimmedTitle = entryTitle?.trim();
  const confirmMessage = trimmedTitle ? (
    <>
      {t.deleteQuestion}{" "}
      <strong className="confirm-subject">{`"${trimmedTitle}"`}</strong>
      {t.deleteWarning}
    </>
  ) : (
    t.deleteMessage
  );

  const confirmDelete = async () => {
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
      setConfirmOpen(false);
    }
  };

  return (
    <div style={inline ? STYLES.rowInline : STYLES.row}>
      <Link href={`/entry/${entryId}/edit`} style={STYLES.edit}>
        {t.edit}
      </Link>
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        disabled={deleting}
        style={deleting ? { ...STYLES.delete, ...STYLES.deleteDisabled } : STYLES.delete}
      >
        {t.delete}
      </button>
      {message ? (
        <p style={STYLES.message} role="alert">
          {message}
        </p>
      ) : null}

      {confirmOpen ? (
        <ConfirmDialog
          title={t.deleteTitle}
          message={confirmMessage}
          confirmLabel={t.delete}
          cancelLabel={t.deleteCancel}
          busyLabel={t.deleting}
          busy={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      ) : null}
    </div>
  );
};

export default EntryOwnerControls;
