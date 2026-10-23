"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getTranslations } from "../lib/i18n/index.js";
import { validateEntry } from "../lib/validation/entry.js";
import EntryContentFields from "./EntryContentFields.js";
import EntryMetaFields from "./EntryMetaFields.js";
import Spinner from "./Spinner.js";

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
// message to show the user. After a successful save we either show a success
// message (when `successMessage` is given, e.g. for new contributions) or
// send the user to `redirectTo` (the default behaviour for edits).
const EntryForm = ({
  lang,
  initialValues,
  requirePhoto = true,
  submitLabel,
  submittingLabel,
  photoHint,
  existingPhotoUrl = null,
  redirectTo = "/profile",
  successMessage = null,
  onSave,
}) => {
  const router = useRouter();
  const t = getTranslations(lang).contribute;
  const [values, setValues] = useState(initialValues ?? EMPTY_VALUES);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (field) => (event) =>
    setValues((prev) => ({ ...prev, [field]: event.target.value }));

  const toggleTag = (tag) =>
    setValues((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((item) => item !== tag)
        : [...prev.tags, tag],
    }));

  const handlePhoto = (file) => setValues((prev) => ({ ...prev, photo: file }));

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
      // A successMessage means "stay here and confirm receipt" (new
      // contributions); otherwise redirect as callers did before.
      if (successMessage) {
        setSubmitted(true);
      } else {
        router.push(redirectTo);
      }
    } catch (unexpected) {
      console.error("Unexpected error while saving entry:", unexpected);
      setFormError(t.errorGeneric);
    } finally {
      setSubmitting(false);
    }
  };

  // New contributions replace the whole form with a confirmation screen; the
  // entry has gone to review instead of being published for everyone.
  if (submitted && successMessage) {
    return (
      <div className="c-success" role="status">
        <p className="c-success-title">{t.successTitle}</p>
        <p className="c-success-message">{successMessage}</p>
        <div className="c-success-actions">
          <Link href="/my-entries" className="c-success-link">
            {t.successViewEntries}
          </Link>
          <Link href="/" className="c-success-link-secondary">
            {t.successGoHome}
          </Link>
        </div>
      </div>
    );
  }

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
        existingPhotoUrl={existingPhotoUrl}
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
        {submitting ? <Spinner /> : null}
        {submitting ? submittingLabel : submitLabel}
      </button>
    </form>
  );
};

export default EntryForm;
