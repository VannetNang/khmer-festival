"use client";

import { useEffect } from "react";
import Spinner from "./Spinner.js";
import { FONT } from "../lib/styles/fonts.js";

// Modal that asks the reviewer to explain why an entry is being returned. The
// typed note is sent back to ReviewQueue, which forwards it to the updated
// review_entry RPC (decision = 'returned', note = the reason). Reuses the app's
// existing confirm dialog styling so it matches every other modal.
const STYLES = {
  noteLabel: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "var(--text-muted)",
    margin: "0 0 16px",
  },
  textarea: {
    display: "block",
    width: "100%",
    minHeight: 96,
    padding: "10px 12px",
    fontSize: 14,
    lineHeight: 1.7,
    fontFamily: FONT,
    color: "var(--text)",
    backgroundColor: "var(--bg)",
    border: "1px solid var(--border-strong)",
    borderRadius: 10,
    boxSizing: "border-box",
    resize: "vertical",
    outline: "none",
    marginTop: 6,
  },
};

const ReviewReturnDialog = ({
  title,
  label,
  placeholder,
  value,
  onChange,
  confirmLabel,
  busyLabel,
  cancelLabel,
  busy = false,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape" && !busy) onCancel();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [busy, onCancel]);

  return (
    <div
      className="confirm-backdrop"
      style={{ zIndex: 90 }}
      onClick={(event) => {
        event.stopPropagation();
        if (!busy) onCancel();
      }}
    >
      <div
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="confirm-title">{title}</h2>
        <label style={STYLES.noteLabel}>
          {label}
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            style={STYLES.textarea}
            autoFocus
          />
        </label>
        <div className="confirm-actions">
          <button
            type="button"
            className="confirm-cancel"
            onClick={onCancel}
            disabled={busy}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="confirm-delete"
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? <Spinner /> : null}
            {busy ? busyLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewReturnDialog;
