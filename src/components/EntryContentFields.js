"use client";

import { CATEGORIES } from "../lib/validation/entry.js";
import EntryFormField from "./EntryFormField.js";

// The identity + narrative fields: both titles, category, both descriptions.
const EntryContentFields = ({ values, errors, t, onChange }) => (
  <>
    <EntryFormField
      id="titleKhmer"
      label={t.fields.titleKhmer}
      error={errors.titleKhmer && t.errors.titleKhmer}
    >
      <input
        id="titleKhmer"
        className="c-input"
        type="text"
        lang="km"
        value={values.titleKhmer}
        onChange={onChange("titleKhmer")}
      />
    </EntryFormField>

    <EntryFormField
      id="titleEnglish"
      label={t.fields.titleEnglish}
      error={errors.titleEnglish && t.errors.titleEnglish}
    >
      <input
        id="titleEnglish"
        className="c-input"
        type="text"
        value={values.titleEnglish}
        onChange={onChange("titleEnglish")}
      />
    </EntryFormField>

    <EntryFormField
      id="category"
      label={t.fields.category}
      error={errors.category && t.errors.category}
    >
      <select
        id="category"
        className="c-input"
        value={values.category}
        onChange={onChange("category")}
      >
        <option value="">{t.selectCategory}</option>
        {CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </EntryFormField>

    <EntryFormField
      id="descriptionKhmer"
      label={t.fields.descriptionKhmer}
      error={errors.descriptionKhmer && t.errors.descriptionKhmer}
    >
      <textarea
        id="descriptionKhmer"
        className="c-input"
        lang="km"
        rows={8}
        value={values.descriptionKhmer}
        onChange={onChange("descriptionKhmer")}
      />
    </EntryFormField>

    <EntryFormField
      id="descriptionEnglish"
      label={t.fields.descriptionEnglish}
      error={errors.descriptionEnglish && t.errors.descriptionEnglish}
    >
      <textarea
        id="descriptionEnglish"
        className="c-input"
        rows={8}
        value={values.descriptionEnglish}
        onChange={onChange("descriptionEnglish")}
      />
    </EntryFormField>
  </>
);

export default EntryContentFields;
