import { createClient } from "../../lib/supabase/server.js";
import ReviewPageView from "../../components/ReviewPageView.js";

export default async function ReviewPage() {
  const supabase = await createClient();

  // Gate: only reviewers may see anything here. Any failure or a non-true
  // answer is treated the same way — ReviewPageView shows the permission
  // message and nothing else, and the pending rows are never even fetched.
  let isReviewer = false;
  try {
    const { data, error } = await supabase.rpc("is_reviewer");
    if (error) {
      console.error("is_reviewer check failed:", error.message);
    } else {
      isReviewer = data === true;
    }
  } catch (unexpected) {
    console.error("is_reviewer check threw:", unexpected);
  }

  if (!isReviewer) {
    return <ReviewPageView reviewer={false} initialEntries={[]} />;
  }

  // Oldest submissions first, so nothing waits at the back of the queue.
  const { data: rows, error: entriesError } = await supabase
    .from("archive_entries")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  return (
    <ReviewPageView
      reviewer
      initialEntries={rows ?? []}
      loadFailed={Boolean(entriesError)}
    />
  );
}
