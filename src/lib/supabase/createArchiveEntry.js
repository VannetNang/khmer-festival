import { uploadEntryPhoto } from "./uploadEntryPhoto.js";

// Uploads the photo, then inserts the entry. owner always comes from the
// signed-in user passed in, never from the form. Text fields are trimmed here
// so both the storage and database writes use clean values.
//
// Returns { id } on success, or { error: "upload" | "save" } on failure.
// The real error is logged with console.error for the developer; callers only
// show a short, actionable message to the user.
export async function createArchiveEntry({ supabase, userId, values, photo }) {
  let imagePath;
  try {
    imagePath = await uploadEntryPhoto(supabase, userId, photo);
  } catch (error) {
    console.error("Photo upload failed:", error);
    return { error: "upload" };
  }

  const { data, error } = await supabase
    .from("archive_entries")
    .insert({
      title_khmer: values.titleKhmer.trim(),
      title_english: values.titleEnglish.trim(),
      category: values.category,
      description_khmer: values.descriptionKhmer.trim(),
      description_english: values.descriptionEnglish.trim(),
      season_or_month: values.month,
      source: values.source.trim(),
      tags: values.tags.length > 0 ? values.tags : null,
      image_path: imagePath,
      owner: userId,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Saving entry failed:", error.message);
    return { error: "save" };
  }

  return { id: data.id };
}
