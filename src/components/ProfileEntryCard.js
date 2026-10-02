"use client";

import EntryCard from "./EntryCard.js";
import EntryOwnerControls from "./EntryOwnerControls.js";

// A profile card: the ordinary entry card plus prominent Edit/Delete controls.
// onDeleted is passed up so the profile list can remove the card in place.
const ProfileEntryCard = ({ entry, lang, onDeleted }) => (
  <EntryCard
    entry={entry}
    lang={lang}
    actions={
      <EntryOwnerControls
        entryId={entry.id}
        isOwner
        lang={lang}
        onDeleted={onDeleted}
      />
    }
  />
);

export default ProfileEntryCard;
