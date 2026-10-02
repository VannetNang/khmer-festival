// Rows come back from Postgres in snake_case, but EntryCard reads camelCase.
// tags is nullable in the table, so fall back to an empty array for the card.
export function toCardEntry(row) {
  return {
    id: row.id,
    titleKhmer: row.title_khmer,
    titleEnglish: row.title_english,
    category: row.category,
    descriptionKhmer: row.description_khmer,
    descriptionEnglish: row.description_english,
    seasonOrMonth: row.season_or_month,
    source: row.source,
    imagePath: row.image_path,
    tags: row.tags ?? [],
  };
}
