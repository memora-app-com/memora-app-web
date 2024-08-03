import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import SignOutButton from "@/components/SignOutButton";

export default async function PrivatePage() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return <SignOutButton />;
}
