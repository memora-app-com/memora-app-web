"use server";

import { redirect } from "next/navigation";
import { createClient } from "./server";

export async function signOut(formData: FormData) {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return redirect("/error");
  }

  return redirect("/login");
}
