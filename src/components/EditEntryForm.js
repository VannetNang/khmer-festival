"use client";

import { createClient } from "../lib/supabase/client.js";
import { updateArchiveEntry } from "../lib/supabase/updateArchiveEntry.js";
import { getTranslations } from "../lib/i18n/index.js";
import EntryForm from "./EntryForm.js";

// Edit mode for the shared entry form. A new photo is optional: when none is
// chosen, the existing image_path is kept. When the entry was returned by the
// reviewer, the feedback note is shown at the top of the form, the submit
// button becomes "Re-post" (the owner is re-submitting after fixing), and the
// resubmission lands back on /my-entries so they can see the new status.
const EditEntryForm = ({ lang, entry }) => {
  const t = getTranslations(lang).contribute;
  const te = getTranslations(lang).entry;
  const isReturned = entry.status === "returned";

  const initialValues = {
    titleKhmer: entry.title_khmer,
    titleEnglish: entry.title_english,
    category: entry.category,
    descriptionKhmer: entry.description_khmer,
    descriptionEnglish: entry.description_english,
    month: entry.season_or_month,
    source: entry.source,
    tags: entry.tags ?? [],
    photo: null,
  };

  const handleSave = async (values) => {
    const supabase = createClient();
    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;
    if (!user) return { error: t.errorSession };

    const result = await updateArchiveEntry({
      supabase,
      entryId: entry.id,
      userId: user.id,
      // Tells updateArchiveEntry that an edit of a returned entry must always
      // go back to 'pending', no matter who performs it.
      currentStatus: entry.status,
      values,
      // When no new file was chosen this is null, so updateArchiveEntry keeps
      // the entry's current image_path instead of failing.
      photo: values.photo,
      currentImagePath: entry.image_path,
    });

    if (result.error === "upload") return { error: t.errorUpload };
    if (result.error) return { error: te.changeNotSaved };
    return { id: result.id };
  };

  return (
    <EntryForm
      lang={lang}
      initialValues={initialValues}
      requirePhoto={false}
      existingPhotoUrl={entry.image_path}
      submitLabel={isReturned ? te.repost : te.save}
      submittingLabel={isReturned ? te.reposting : te.saving}
      photoHint={te.photoOptionalHint}
      redirectTo={isReturned ? "/my-entries" : "/profile"}
      notice={
        isReturned && entry.review_note ? (
          <>
            <span className="c-review-note-title">{te.editReviewNoteTitle}</span>
            {entry.review_note}
          </>
        ) : null
      }
      onSave={handleSave}
    />
  );
};

export default EditEntryForm;
