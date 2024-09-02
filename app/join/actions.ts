"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function loginAnonymously() {
  const supabase = createClient();

  const { error } = await supabase.auth.signInAnonymously();

  if (error) {
    redirect("/join?error=" + error.message);
  }
}