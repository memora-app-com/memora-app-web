"use server";

import { redirect, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import CreateEventClient from "./CreateEventClient";

export default async function CreateEvent() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    redirect("/login");
  }

  return <CreateEventClient user={user} />;
}
