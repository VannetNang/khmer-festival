// Deletes an entry and confirms a row actually came back. Row Level Security
// can silently delete nothing without raising an error, so we rely on the
// returned rows rather than the error alone.
//
// Returns { id } on success, or { error: "blocked" } on failure.
export async function deleteArchiveEntry(supabase, entryId) {
  const { data, error } = await supabase
    .from("archive_entries")
    .delete()
    .eq("id", entryId)
    .select();

  if (error) {
    console.error("Deleting entry failed:", error.message);
    return { error: "blocked" };
  }
  if (!data || data.length === 0) {
    console.error(
      "Deleting entry returned no row (blocked by RLS or entry missing).",
    );
    return { error: "blocked" };
  }

  return { id: data[0].id };
}
