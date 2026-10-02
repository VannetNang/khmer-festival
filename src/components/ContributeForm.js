"use client";

import { createClient } from "../lib/supabase/client.js";
import { createArchiveEntry } from "../lib/supabase/createArchiveEntry.js";
import { getTranslations } from "../lib/i18n/index.js";
import EntryForm from "./EntryForm.js";

// Create mode for the shared entry form: checks the session, uploads the
// required photo, and inserts a new archive row.
const ContributeForm = ({ lang }) => {
  const t = getTranslations(lang).contribute;

  const handleSave = async (values) => {
    const supabase = createClient();
    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;
    if (!user) return { error: t.errorSession };

    const result = await createArchiveEntry({
      supabase,
      userId: user.id,
      values,
      photo: values.photo,
    });

    if (result.error) {
      return { error: result.error === "upload" ? t.errorUpload : t.errorSave };
    }
    return { id: result.id };
  };

  return (
    <EntryForm
      lang={lang}
      requirePhoto
      submitLabel={t.submit}
      submittingLabel={t.submitting}
      onSave={handleSave}
    />
  );
};

export default ContributeForm;
