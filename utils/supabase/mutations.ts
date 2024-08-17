"use client";

import { createClient } from "./client";
import type { Database, Tables } from "@/database.types";

// TODO: Check the implications of using supabaseAdmin with SERVICE_ROLE_KEY
// versus supabase with ANON_KEY and policies set accordingly
const supabase = createClient();
const bucketName = "momentz-bucket";

const createOrRetrieveUser = async (props: { uuid: string; email: string }) => {
  const { data: retrievedUser, error: retrieveError } = await supabase
    .from("users")
    .select("*")
    .eq("id", props.uuid)
    .single();

  if (retrieveError) {
    throw new Error(`Supabase user retrieval failed: ${retrieveError.message}`);
  }

  if (retrievedUser) {
    return retrievedUser;
  }

  const { data, error } = await supabase
    .from("users")
    .insert({
      id: props.uuid,
      email: props.email,
      name: "John Doe",
    })
    .select();

  if (error) {
    throw new Error(`Supabase customer creation failed: ${error.message}`);
  }

  return data[0];
};

const updateUserPlan = async (props: { userId: number; planId: number }) => {
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

const createEvent = async (props: {
  name: string;
  description: string;
  code: string;
  startDate: Date;
  endDate: Date;
  userId: string;
}) => {
  const { data, error } = await supabase
    .from("events")
    .insert({
      name: props.name,
      description: props.description,
      code: props.code,
      start_date: props.startDate.toISOString(),
      end_date: props.endDate.toISOString(),
      host_id: props.userId,
    })
    .select();

  if (error) {
    throw new Error(`Supabase event creation failed: ${error.message}`);
  }

  console.log(data, error);
  return data[0];
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

export {
  createOrRetrieveUser,
  updateUserPlan,
  createEvent,
  createPhotos,
  deletePhotoObjects,
};
