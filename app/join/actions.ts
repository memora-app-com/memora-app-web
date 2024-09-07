"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function loginAnonymously() {
  console.log("before createClient");
  const supabase = createClient();
  console.log("after createClient");
  const { error } = await supabase.auth.signInAnonymously();
  console.log("after signInAnonymously");
  console.log(error);
  console.log(error.message);

  if (error) {
    redirect("/join?error=" + error.message);
  }
}