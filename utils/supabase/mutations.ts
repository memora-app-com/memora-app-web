"use client";

import { createClient } from "./client";
import type { Database, Tables } from "@/database.types";

// TODO: Check the implications of using supabaseAdmin with SERVICE_ROLE_KEY
// versus supabase with ANON_KEY and policies set accordingly
const supabase = createClient();
const bucketName = "momentz-bucket";

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

const createEventForUser = async (props: {
  name: string;
  description: string;
  code: string;
  startDate: Date;
  endDate: Date;
  userId: string;
}) => {
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*, events (*)")
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
    if (user.events && user.events.length > 0) {
      throw new Error("User already has an event");
    }
    photosLimit = 5;
  }

  const { data: event, error: eventError } = await supabase
    .from("events")
    .insert({
      name: props.name,
      description: props.description,
      code: props.code,
      start_date: props.startDate.toISOString(),
      end_date: props.endDate.toISOString(),
      host_id: props.userId,
      photos_limit: photosLimit,
    })
    .select();

  if (eventError) {
    throw new Error(`Supabase event creation failed: ${eventError.message}`);
  }

  if (user.plan_id === 2) {
    await updateUserPlan({ userId: props.userId, planId: 1 });
  }

  return event[0];
};

const createPhotos = async (
  props: {
    eventId: number;
    userId: string;
    url: string;
  }[]
) => {
  const { data, error } = await supabase
    .from("photos")
    .upsert(
      props.map((photo) => ({
        event_id: photo.eventId,
        user_id: photo.userId,
        url: photo.url,
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

export { updateUserPlan, createEventForUser, createPhotos, deletePhotoObjects };
