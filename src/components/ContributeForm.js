"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client.js";
import { createArchiveEntry } from "../lib/supabase/createArchiveEntry.js";
import { getTranslations } from "../lib/i18n/index.js";
import { validateEntry } from "../lib/validation/entry.js";
import EntryContentFields from "./EntryContentFields.js";
import EntryMetaFields from "./EntryMetaFields.js";

const EMPTY_VALUES = {
  titleKhmer: "",
  titleEnglish: "",
  category: "",
  descriptionKhmer: "",
  descriptionEnglish: "",
  month: "",
  source: "",
  tags: [],
  photo: null,
};

const ContributeForm = ({ lang }) => {
  const router = useRouter();
  const t = getTranslations(lang).contribute;
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (event) =>
    setValues((prev) => ({ ...prev, [field]: event.target.value }));

  const toggleTag = (tag) =>
    setValues((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((item) => item !== tag)
        : [...prev.tags, tag],
    }));

  const handlePhoto = (event) =>
    setValues((prev) => ({ ...prev, photo: event.target.files?.[0] ?? null }));

  const handleSubmit = async (event) => {
    event.preventDefault();

    const found = validateEntry(values, values.photo);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setFormError(null);
    setSubmitting(true);

    try {
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;
      if (!user) {
        setFormError(t.errorSession);
        return;
      }

      const result = await createArchiveEntry({
        supabase,
        userId: user.id,
        values,
        photo: values.photo,
      });

      if (result.error) {
        setFormError(result.error === "upload" ? t.errorUpload : t.errorSave);
        return;
      }

      router.push(`/entry/${result.id}`);
    } catch (unexpected) {
      console.error("Unexpected error while saving entry:", unexpected);
      setFormError(t.errorGeneric);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="contribute-form" onSubmit={handleSubmit} noValidate>
      <EntryContentFields
        values={values}
        errors={errors}
        t={t}
        onChange={update}
      />
      <EntryMetaFields
        values={values}
        errors={errors}
        t={t}
        onChange={update}
        onToggleTag={toggleTag}
        onPhotoChange={handlePhoto}
      />

      {formError ? (
        <p className="c-form-error" role="alert">
          {formError}
        </p>
      ) : null}

      <button type="submit" className="c-submit" disabled={submitting}>
        {submitting ? t.submitting : t.submit}
      </button>
    </form>
  );
};

export default ContributeForm;
