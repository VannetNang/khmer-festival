// Updates an entry's content. The photo is optional: when a new file is given
// it is uploaded first and replaces image_path; otherwise the existing path is
// kept. owner is never changed here.
//
// Returns { id } on success, or { error: "upload" | "blocked" } on failure.
export async function updateArchiveEntry({
  supabase,
  entryId,
  userId,
  values,
  photo,
  currentImagePath,
}) {
  let imagePath = currentImagePath;

  if (photo) {
    try {
      imagePath = await uploadEntryPhoto(supabase, userId, photo);
    } catch (error) {
      console.error("Photo upload failed:", error);
      return { error: "upload" };
    }
  }

  // .select() makes Supabase return the updated rows so we can confirm a row
  // actually came back and was not silently blocked by Row Level Security.
  const { data, error } = await supabase
    .from("archive_entries")
    .update({
      title_khmer: values.titleKhmer.trim(),
      title_english: values.titleEnglish.trim(),
      category: values.category,
      description_khmer: values.descriptionKhmer.trim(),
      description_english: values.descriptionEnglish.trim(),
      season_or_month: values.month,
      source: values.source.trim(),
      tags: values.tags.length > 0 ? values.tags : null,
      image_path: imagePath,
    })
    .eq("id", entryId)
    .select();

  if (error) {
    console.error("Updating entry failed:", error.message);
    return { error: "blocked" };
  }
  if (!data || data.length === 0) {
    console.error(
      "Updating entry returned no row (blocked by RLS or entry missing).",
    );
    return { error: "blocked" };
  }

  return { id: data[0].id };
}
