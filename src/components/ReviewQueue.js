"use client";

import { useRef, useState } from "react";
import { createClient } from "../lib/supabase/client.js";
import { getTranslations } from "../lib/i18n/index.js";
import { useLanguage } from "../lib/i18n/LanguageProvider.js";
import { FONT } from "../lib/styles/fonts.js";
import ReviewDetailDialog from "./ReviewDetailDialog.js";
import ReviewEntryCard from "./ReviewEntryCard.js";
import ReviewReturnDialog from "./ReviewReturnDialog.js";

// The interactive half of /review. The server page already proved this visitor
// is a reviewer and handed over the pending rows; this component turns the
// Publish / Return buttons into review_entry RPC calls and updates the list
// locally, so a decided entry disappears without a full page reload. Note that
// the archive_entries table is never written to directly — only the RPC decides.
// All visible strings come from getTranslations(lang).review so the review
// screen switches with the app language like every other page.
const STYLES = {
  controls: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  search: {
    flex: 1,
    minWidth: 240,
    padding: "10px 18px",
    fontSize: 14,
    lineHeight: 1.6,
    fontFamily: FONT,
    color: "var(--text)",
    backgroundColor: "var(--surface)",
    border: "1px solid var(--border-strong)",
    borderRadius: 999,
    outline: "none",
    boxSizing: "border-box",
  },
  sort: {
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: 600,
    color: "var(--text)",
    backgroundColor: "var(--surface)",
    border: "1px solid var(--border-strong)",
    borderRadius: 999,
    padding: "10px 14px",
    cursor: "pointer",
  },
  empty: {
    fontFamily: FONT,
    fontSize: 15,
    color: "var(--text-dim)",
    textAlign: "center",
    padding: "48px 20px",
    backgroundColor: "var(--surface)",
    border: "1px dashed var(--border-strong)",
    borderRadius: 14,
    margin: 0,
  },
  message: {
    fontFamily: FONT,
    fontSize: 14,
    color: "var(--danger)",
    backgroundColor: "var(--danger-soft)",
    border: "1px solid var(--danger-border)",
    borderRadius: 10,
    padding: "12px 16px",
    margin: "0 0 20px",
  },
  count: {
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: 600,
    color: "var(--text-muted)",
    margin: "0 0 16px",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "grid",
    // A true responsive grid (like the archive's card grid): a lone pending
    // entry occupies ONE ~320px track at the same compact size it would have
    // next to other cards, instead of stretching full-width.
    gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
    gap: 20,
    width: "100%",
    boxSizing: "border-box",
    alignItems: "stretch",
  },
};

const ReviewQueue = ({ initialEntries }) => {
  const { lang } = useLanguage();
  const t = getTranslations(lang).review;
  const [entries, setEntries] = useState(initialEntries);
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState(null);
  const [noteForId, setNoteForId] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [detailId, setDetailId] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("oldest");
  // Khmer is an IME script: characters only settle when composition ends, so
  // defer re-filtering until then (mirrors the home SearchInput behaviour).
  const composingRef = useRef(false);

  const handleSearchChange = (event) => {
    setInputValue(event.target.value);
    if (!composingRef.current) setQuery(event.target.value);
  };

  const handleCompositionStart = () => {
    composingRef.current = true;
  };

  const handleCompositionEnd = (event) => {
    composingRef.current = false;
    setInputValue(event.target.value);
    setQuery(event.target.value);
  };

  // The result is checked strictly: only a literal data === true removes the
  // entry from the queue; anything else — a false result, an RPC error, or a
  // thrown network error — leaves the entry in place and surfaces the shared
  // failure message. Publish passes note: null; Return passes the reviewer's
  // typed note so the contributor knows what to fix.
  const applyDecision = async (entryId, decision, note) => {
    setBusyId(entryId);
    setMessage(null);
    try {
      const { data, error } = await createClient().rpc("review_entry", {
        entry_id: entryId,
        decision,
        note,
      });
      if (!error && data === true) {
        setEntries((prev) => prev.filter((entry) => entry.id !== entryId));
      } else {
        if (error) console.error("review_entry RPC failed:", error.message);
        setMessage(t.error);
      }
    } catch (unexpected) {
      console.error("review_entry RPC threw:", unexpected);
      setMessage(t.error);
    } finally {
      setBusyId(null);
    }
  };

  const publishEntry = (entryId) => applyDecision(entryId, "published", null);

  // "Explore More" opens the full detail modal for an entry.
  const openDetail = (entryId) => setDetailId(entryId);

  // Return never fires straight away: the reviewer first writes the reason.
  const openReturnNote = (entryId) => {
    setNoteForId(entryId);
    setNoteText("");
  };

  const cancelReturnNote = () => {
    setNoteForId(null);
    setNoteText("");
  };

  const confirmReturn = async () => {
    if (noteForId == null) return;
    setSubmitting(true);
    await applyDecision(noteForId, "returned", noteText.trim() || null);
    setSubmitting(false);
    cancelReturnNote();
  };

  // Filter the queue by title/description, then order it by submitted date.
  // A search that matches nothing shows the same empty message as an empty
  // queue, since both mean there is nothing waiting to be reviewed.
  const q = query.trim().toLowerCase();
  const visible = [...entries]
    .filter((entry) => {
      if (!q) return true;
      return [
        entry.title_khmer,
        entry.title_english,
        entry.description_khmer,
        entry.description_english,
      ].some((text) => (text || "").toLowerCase().includes(q));
    })
    .sort((a, b) => {
      const diff = new Date(a.created_at) - new Date(b.created_at);
      return sortOrder === "oldest" ? diff : -diff;
    });

  // The entry shown in the "Explore More" modal; resolving it from the current
  // list means the modal closes itself as soon as the entry is decided.
  const detailEntry = entries.find((entry) => entry.id === detailId) ?? null;

  return (
    <>
      <p style={STYLES.count}>{t.pendingCount(entries.length)}</p>

      <div style={STYLES.controls}>
        <input
          type="search"
          value={inputValue}
          onChange={handleSearchChange}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          placeholder={t.searchPlaceholder}
          style={STYLES.search}
          aria-label={t.searchPlaceholder}
        />
        <select
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value)}
          style={STYLES.sort}
          aria-label={t.sortOldest}
        >
          <option value="oldest">{t.sortOldest}</option>
          <option value="newest">{t.sortNewest}</option>
        </select>
      </div>

      {message ? (
        <p role="alert" style={STYLES.message}>
          {message}
        </p>
      ) : null}

      {visible.length === 0 ? (
        <p style={STYLES.empty}>{t.empty}</p>
      ) : (
        <ul style={STYLES.list}>
          {visible.map((entry) => (
            <li key={entry.id} style={{ margin: 0, width: "100%", minWidth: 0 }}>
              <ReviewEntryCard
                entry={entry}
                busy={busyId === entry.id}
                onPublish={publishEntry}
                onReturn={openReturnNote}
                onExplore={openDetail}
              />
            </li>
          ))}
        </ul>
      )}

      {detailEntry ? (
        <ReviewDetailDialog
          entry={detailEntry}
          busy={busyId === detailEntry.id}
          t={t}
          onPublish={publishEntry}
          onReturn={openReturnNote}
          onClose={() => setDetailId(null)}
        />
      ) : null}

      {noteForId ? (
        <ReviewReturnDialog
          title={t.returnNoteTitle}
          label={t.returnNoteLabel}
          placeholder={t.returnNotePlaceholder}
          value={noteText}
          onChange={setNoteText}
          confirmLabel={t.confirmReturn}
          busyLabel={t.returning}
          cancelLabel={t.cancel}
          busy={submitting}
          onConfirm={confirmReturn}
          onCancel={cancelReturnNote}
        />
      ) : null}
    </>
  );
};

export default ReviewQueue;
