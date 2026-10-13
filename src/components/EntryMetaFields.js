"use client";

import { MONTHS, TAG_OPTIONS } from "../lib/validation/entry.js";
import EntryFormField from "./EntryFormField.js";
import PhotoField from "./PhotoField.js";

// The metadata fields: month, source, tags, and the photo.
const EntryMetaFields = ({
  values,
  errors,
  t,
  photoHint,
  existingPhotoUrl,
  onChange,
  onToggleTag,
  onPhotoChange,
}) => (
  <>
    <EntryFormField
      id="month"
      label={t.fields.month}
      error={errors.month && t.errors.month}
    >
      <select
        id="month"
        className="c-input"
        value={values.month}
        onChange={onChange("month")}
      >
        <option value="">{t.selectMonth}</option>
        {MONTHS.map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>
    </EntryFormField>

    <EntryFormField
      id="source"
      label={t.fields.source}
      error={errors.source && t.errors.source}
    >
      <input
        id="source"
        className="c-input"
        type="text"
        value={values.source}
        onChange={onChange("source")}
      />
    </EntryFormField>

    <EntryFormField label={t.fields.tags} error={errors.tags && t.errors.tags}>
      <div className="c-tags">
        {TAG_OPTIONS.map((tag) => (
          <label key={tag} className="c-tag">
            <input
              type="checkbox"
              checked={values.tags.includes(tag)}
              onChange={() => onToggleTag(tag)}
            />
            {tag}
          </label>
        ))}
      </div>
    </EntryFormField>

    <PhotoField
      t={t}
      error={errors.photo && t.errors.photo}
      hint={photoHint}
      existingPhotoUrl={existingPhotoUrl}
      onSelect={onPhotoChange}
    />
  </>
);

export default EntryMetaFields;
