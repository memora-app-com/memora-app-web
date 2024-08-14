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

const fetchPhotos = cache(async (eventId) => {
  const { data, error } = await supabase
    .from("photos")
    .select()
    .eq("event_id", eventId);

  if (error) throw error;

  return data;
});

const fetchRandomEventCode = async () => {
  const { data, error } = await supabase
    .rpc('get_random_event_code');
  
  if (error) throw error;

  return data;
};

export { fetchUserProfile, fetchEvent, fetchPhotos, fetchRandomEventCode };
