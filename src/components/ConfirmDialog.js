"use client";

import { useEffect } from "react";
import Spinner from "./Spinner.js";

// Styled confirmation dialog used before destructive actions (deleting an
// entry), replacing the browser's window.confirm().
const ConfirmDialog = ({
  title,
  message,
  confirmLabel,
  cancelLabel,
  busyLabel,
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
      onClick={() => {
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
        <p className="confirm-message">{message}</p>
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

export default ConfirmDialog;
