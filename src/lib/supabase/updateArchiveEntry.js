import { uploadEntryPhoto } from "./uploadEntryPhoto.js";

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
  currentStatus,
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

  // Ask the database whether the current user is a reviewer. Only reviewers may
  // keep an entry published after an edit; everyone else's edit is sent back to
  // 'pending' so it is reviewed again. If the check fails for any reason we
  // treat the user as a regular contributor (the safe, pending direction).
  let isReviewer = false;
  const { data: reviewerFlag, error: reviewerError } = await supabase.rpc(
    "is_reviewer",
  );
  if (reviewerError) {
    console.error("is_reviewer check failed:", reviewerError.message);
  } else {
    isReviewer = Boolean(reviewerFlag);
  }

  const patch = {
    title_khmer: values.titleKhmer.trim(),
    title_english: values.titleEnglish.trim(),
    category: values.category,
    description_khmer: values.descriptionKhmer.trim(),
    description_english: values.descriptionEnglish.trim(),
    season_or_month: values.month,
    source: values.source.trim(),
    tags: values.tags.length > 0 ? values.tags : null,
    image_path: imagePath,
  };
  // A returned entry must always be re-reviewed: editing and re-submitting it
  // sends it back to 'pending' (the front door to a fresh review cycle) no
  // matter who performs the edit. Everyone else's edits also drop to 'pending'
  // unless the editor is a reviewer maintaining a published entry.
  if (currentStatus === "returned") {
    patch.status = "pending";
  } else if (!isReviewer) {
    patch.status = "pending";
  }

  // .select() makes Supabase return the updated rows so we can confirm a row
  // actually came back and was not silently blocked by Row Level Security.
  const { data, error } = await supabase
    .from("archive_entries")
    .update(patch)
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
