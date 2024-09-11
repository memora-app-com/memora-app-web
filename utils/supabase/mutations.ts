"use client";

import { createClient } from "./client";
import type { Database, Tables } from "@/database.types";

// TODO: Check the implications of using supabaseAdmin with SERVICE_ROLE_KEY
// versus supabase with ANON_KEY and policies set accordingly
const supabase = createClient();
const bucketName = "main-bucket";

const updateUserPlan = async (props: { userId: string; planId: number }) => {
  const { data, error } = await supabase
    .from("users")
    .update({ plan_id: props.planId })
    .eq("id", props.userId)
    .select();

  if (error) {
    throw new Error(`Supabase user update failed: ${error.message}`);
  }

  return data[0];
};

const createGalleryForUser = async (props: {
  title: string;
  description: string;
  code: string;
  startDate: Date;
  endDate: Date;
  userId: string;
}) => {
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*, galleries (*)")
    .eq("id", props.userId)
    .single();

  if (userError) {
    throw new Error(`Supabase user retrieval failed: ${userError.message}`);
  }

  if (!user) {
    throw new Error(`User with ID ${props.userId} not found`);
  }

  let photosLimit = null;
  if (user.plan_id === 1) {
    if (user.galleries && user.galleries.length > 0) {
      throw new Error("User already has a gallery. Please upgrade your plan.");
    }
    photosLimit = 5;
  }

  const { data: gallery, error: galleryError } = await supabase
    .from("galleries")
    .insert({
      title: props.title,
      description: props.description,
      code: props.code,
      start_date: props.startDate.toISOString(),
      end_date: props.endDate.toISOString(),
      host_id: props.userId,
      photos_limit: photosLimit,
    })
    .select();

  if (galleryError) {
    if (galleryError.code === "23505") {
      throw new Error(
        `Event with code ${props.code} already exists. 
        Please choose a different code or leave it empty to generate one automatically.`
      );
    }
    throw new Error(`Event creation failed: ${galleryError.message}`);
  }

  if (user.plan_id === 2) {
    await updateUserPlan({ userId: props.userId, planId: 1 });
  }

  return gallery[0];
};

const createPhotos = async (
  props: {
    galleryId: number;
    userId: string;
    url: string;
    type: "image" | "video";
  }[]
) => {
  const { data, error } = await supabase
    .from("photos")
    .upsert(
      props.map((photo) => ({
        gallery_id: photo.galleryId,
        user_id: photo.userId,
        url: photo.url,
        type: photo.type,
      })),
      { onConflict: "url" }
    )
    .select();

  if (error) {
    throw new Error(`Supabase photo creation failed: ${error.message}`);
  }

  return data;
};

const deletePhotoObjects = async (props: { urls: string[] }) => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .remove(props.urls.map((url) => url.split(`/${bucketName}/`)[1]));

  if (error) {
    throw new Error(`Supabase photo deletion failed: ${error.message}`);
  }

  return data[0];
};

const deletePhotos = async (props: { photos: any[] }) => {
  const photoIds = props.photos.map((photo) => photo.id);
  const firstPhotoId = photoIds[0];
  const { error } = await supabase
    .from("photos")
    .delete()
    .eq("id", firstPhotoId);

  if (error) {
    throw new Error(`Supabase photo deletion failed: ${error.message}`);
  }

  const photoUrls = props.photos.map((photo) => photo.url);
  await deletePhotoObjects({ urls: photoUrls });
};

export {
  updateUserPlan,
  createGalleryForUser,
  createPhotos,
  deletePhotoObjects,
  deletePhotos,
};
