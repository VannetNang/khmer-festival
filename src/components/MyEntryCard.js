"use client";

import EntryCard from "./EntryCard.js";
import EntryOwnerControls from "./EntryOwnerControls.js";
import EntryStatusBadge from "./EntryStatusBadge.js";

// A card on /my-entries: the ordinary entry card plus a prominent status badge
// on the photo and the usual Edit/Delete controls for the owner.
const MyEntryCard = ({ entry, lang, onDeleted }) => (
  <EntryCard
    entry={entry}
    lang={lang}
    from="my-entries"
    topRight={<EntryStatusBadge status={entry.status} lang={lang} />}
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

export default MyEntryCard;
