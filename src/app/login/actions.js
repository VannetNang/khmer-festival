"use server";

import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

// Server Action for the login form. Returns a state object for
// useActionState. On failure we ALWAYS return the same generic message —
// never a more specific reason — so nothing about the account leaks.
export async function login(_prevState, formData) {
  const supabase = await createClient();

  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Invalid email or password" };
  }

  redirect("/");
}
