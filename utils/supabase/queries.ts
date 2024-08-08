import { cache } from "react";
import { createClient } from "./client";

const supabase = createClient();

const fetchUserProfile = cache(async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("id", userId);

  if (error) throw error;

  return data[0];
});

const fetchEvent = cache(async (code) => {
  const { data, error } = await supabase
    .from("events")
    .select()
    .eq("code", code);

  if (error) throw error;

  return data[0];
});

export { fetchUserProfile, fetchEvent };
