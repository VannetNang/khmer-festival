// Shared vocabulary + client-side validation for a contributed entry.
// Pure JavaScript with no imports so it is easy to read and reuse.
// Values here must match what the archive already stores (see schema.sql
// and src/data/entries.js): months and categories are English strings.

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// The categories the archive already uses for its sample entries.
export const CATEGORIES = [
  "National Holiday",
  "Religious Festival",
  "National Festival",
  "Religious Holiday",
  "Royal Ceremony",
  "Royal Holiday",
];

export const TAG_OPTIONS = ["Holiday", "Buddhism", "Celebration"];

// Photo limits. Allowed MIME type -> file extension. The extension is derived
// from this table, never from the user-supplied file name.
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5 MB
export const PHOTO_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const KHMER_RE = /[\u1780-\u17FF]/;
const LATIN_RE = /[A-Za-z]/;

// Returns an object keyed by field name for every field that fails a rule.
// An empty object means the entry is ready to submit. The UI maps each key to
// a short message shown next to that field.
export function validateEntry(values, photo, photoRequired = true) {
  const errors = {};

  const titleKhmer = values.titleKhmer.trim();
  if (!titleKhmer || titleKhmer.length > 120 || !KHMER_RE.test(titleKhmer)) {
    errors.titleKhmer = true;
  }

  const titleEnglish = values.titleEnglish.trim();
  if (!titleEnglish || titleEnglish.length > 120 || !LATIN_RE.test(titleEnglish)) {
    errors.titleEnglish = true;
  }

  const descriptionKhmer = values.descriptionKhmer.trim();
  if (
    !descriptionKhmer ||
    descriptionKhmer.length > 10000 ||
    !KHMER_RE.test(descriptionKhmer)
  ) {
    errors.descriptionKhmer = true;
  }

  const descriptionEnglish = values.descriptionEnglish.trim();
  if (
    !descriptionEnglish ||
    descriptionEnglish.length > 10000 ||
    !LATIN_RE.test(descriptionEnglish)
  ) {
    errors.descriptionEnglish = true;
  }

  const source = values.source.trim();
  if (!source || source.length > 255) errors.source = true;

  if (!MONTHS.includes(values.month)) errors.month = true;
  if (!CATEGORIES.includes(values.category)) errors.category = true;

  if (
    !Array.isArray(values.tags) ||
    values.tags.some((tag) => !TAG_OPTIONS.includes(tag))
  ) {
    errors.tags = true;
  }

  if (photo) {
    if (!PHOTO_TYPES[photo.type] || photo.size > MAX_PHOTO_BYTES) {
      errors.photo = true;
    }
  } else if (photoRequired) {
    errors.photo = true;
  }

  return errors;
}
