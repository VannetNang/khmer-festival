"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

// The single entry form. /contribute and the edit page both render this, so
// they always share the same fields and validation rules.
// `onSave(values)` must return { id } on success, or { error } with a short
// message to show the user. After a successful save we send the user to their
// profile.
const EntryForm = ({
  lang,
  initialValues,
  requirePhoto = true,
  submitLabel,
  submittingLabel,
  photoHint,
  redirectTo = "/profile",
  onSave,
}) => {
  const router = useRouter();
  const t = getTranslations(lang).contribute;
  const [values, setValues] = useState(initialValues ?? EMPTY_VALUES);
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

    const found = validateEntry(values, values.photo, requirePhoto);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setFormError(null);
    setSubmitting(true);

    try {
      const result = await onSave(values);
      if (result?.error) {
        setFormError(result.error);
        return;
      }
      router.push(redirectTo);
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
        photoHint={photoHint ?? t.photoHint}
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
        {submitting ? submittingLabel : submitLabel}
      </button>
    </form>
  );
};

export default EntryForm;
