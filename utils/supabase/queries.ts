import { cache } from "react";
import { createClient } from "./client";

const supabase = createClient();

const fetchUser = cache(async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("id", userId);

  if (error) throw error;

  return data[0];
});

const fetchGallery = cache(async (code) => {
  const { data, error } = await supabase
    .from("galleries")
    .select()
    .eq("code", code);

  if (error) throw error;

  return data[0];
});

const fetchPhotos = cache(async (galleryId) => {
  const { data, error } = await supabase
    .from("photos")
    .select()
    .eq("gallery_id", galleryId);

  if (error) throw error;

  return data;
});

const fetchPlans = cache(async () => {
  const { data, error } = await supabase
    .from("plans")
    .select()
    .eq("is_enabled", true)
    .gt("price", 0);

  if (error) throw error;

  return data;
});

const fetchRandomGalleryCode = async () => {
  const { data, error } = await supabase.rpc("get_random_gallery_code");

  if (error) throw error;

  return data;
};

export {
  fetchUser,
  fetchGallery,
  fetchPhotos,
  fetchPlans,
  fetchRandomGalleryCode,
};
