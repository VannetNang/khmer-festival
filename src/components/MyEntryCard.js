"use client";

import EntryCard from "./EntryCard.js";
import EntryOwnerControls from "./EntryOwnerControls.js";
import EntryStatusBadge from "./EntryStatusBadge.js";
import { getTranslations } from "../lib/i18n/index.js";

// A card on /my-entries: the ordinary entry card plus a prominent status badge
// on the photo and the usual Edit/Delete controls for the owner. Entries the
// reviewer returned carry a note banner so the contributor knows what to fix.
const MyEntryCard = ({ entry, lang, onDeleted }) => {
  const t = getTranslations(lang).myEntries;
  return (
    <EntryCard
      entry={entry}
      lang={lang}
      from="my-entries"
      topRight={<EntryStatusBadge status={entry.status} lang={lang} />}
      note={
        entry.status === "returned" && entry.reviewNote ? (
          <>
            <strong>{t.reviewNoteLabel}: </strong>
            {entry.reviewNote}
          </>
        ) : null
      }
      actions={
        <EntryOwnerControls
          entryId={entry.id}
          entryTitle={lang === "km" ? entry.titleKhmer : entry.titleEnglish}
          isOwner
          lang={lang}
          onDeleted={onDeleted}
        />
      }
    />
  );
};

export default MyEntryCard;
