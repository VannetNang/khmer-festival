"use client";

import { createClient } from "../lib/supabase/client.js";
import { updateArchiveEntry } from "../lib/supabase/updateArchiveEntry.js";
import { getTranslations } from "../lib/i18n/index.js";
import EntryForm from "./EntryForm.js";

// Edit mode for the shared entry form. A new photo is optional: when none is
// chosen, the existing image_path is kept.
const EditEntryForm = ({ lang, entry }) => {
  const t = getTranslations(lang).contribute;
  const te = getTranslations(lang).entry;

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
      values,
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
      submitLabel={te.save}
      submittingLabel={te.saving}
      photoHint={te.photoOptionalHint}
      onSave={handleSave}
    />
  );
};

export default EditEntryForm;
