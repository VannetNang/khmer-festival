"use server";

import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

// Server Action for the sign-up form. Uses Supabase email/password auth.
// On failure we return a single generic message so no specifics leak.
export async function signup(_prevState, formData) {
  const supabase = await createClient();

  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: "Could not create an account. Please try again." };
  }

  redirect("/");
}
