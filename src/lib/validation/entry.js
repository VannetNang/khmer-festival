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

// The categories a contributor can file an entry under.
export const CATEGORIES = [
  "Religious Observances",
  "Royal & National Events",
  "Seasonal & Agricultural",
  "Cultural & Arts",
  "Local & Regional Traditions",
];

// Every tag a contributor can attach to an entry. An entry may use any
// combination of these (the form is multi-select); any other value fails
// validation.
export const TAG_OPTIONS = [
  "Holiday",
  "Buddhism",
  "Celebration",
  "Royal Ceremony",
  "Cultural Heritage",
  "National Holiday",
  "Harvest",
  "Rainy Season",
  "Water & River",
  "Lunar Calendar",
  "Ancestors",
  "Blessing",
  "Pagoda Ritual",
  "Procession",
  "Traditional Games",
  "Classical Dance",
  "Shadow Puppet",
  "Traditional Music",
  "Boat Racing",
];

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
const WHITESPACE_RE = /\s/;

// Minimum text lengths. Validation always measures the *trimmed* value, so a
// field full of spaces counts as empty.
const TITLE_MIN = 5;
const TITLE_MAX = 120;
const DESCRIPTION_MIN = 100;
const DESCRIPTION_MAX = 10000;
const SOURCE_MAX = 255;

// Returns an object keyed by field name for every field that fails a rule.
// An empty object means the entry is ready to submit. The UI maps each key to
// a short message shown next to that field.
export function validateEntry(values, photo, photoRequired = true) {
  const errors = {};

  const titleKhmer = values.titleKhmer.trim();
  if (
    titleKhmer.length < TITLE_MIN ||
    titleKhmer.length > TITLE_MAX ||
    !KHMER_RE.test(titleKhmer)
  ) {
    errors.titleKhmer = true;
  }

  const titleEnglish = values.titleEnglish.trim();
  if (
    titleEnglish.length < TITLE_MIN ||
    titleEnglish.length > TITLE_MAX ||
    !LATIN_RE.test(titleEnglish)
  ) {
    errors.titleEnglish = true;
  }

  const descriptionKhmer = values.descriptionKhmer.trim();
  // Khmer has no word spaces, so only the length and the script are checked.
  if (
    descriptionKhmer.length < DESCRIPTION_MIN ||
    descriptionKhmer.length > DESCRIPTION_MAX ||
    !KHMER_RE.test(descriptionKhmer)
  ) {
    errors.descriptionKhmer = true;
  }

  const descriptionEnglish = values.descriptionEnglish.trim();
  // English must be a real paragraph: long enough AND made of separate words,
  // so one continuous unbroken run of characters is rejected.
  if (
    descriptionEnglish.length < DESCRIPTION_MIN ||
    descriptionEnglish.length > DESCRIPTION_MAX ||
    !LATIN_RE.test(descriptionEnglish) ||
    !WHITESPACE_RE.test(descriptionEnglish)
  ) {
    errors.descriptionEnglish = true;
  }

  const source = values.source.trim();
  if (!source || source.length > SOURCE_MAX) errors.source = true;

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
