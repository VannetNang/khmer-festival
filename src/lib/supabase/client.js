import { createBrowserClient } from "@supabase/ssr";

// Browser-side Supabase client (App Router, @supabase/ssr pattern).
// Reads the URL and anon key from public environment variables.
// Use this in Client Components (prefix the file with "use client" there).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}