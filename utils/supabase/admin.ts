import { Database } from "@/database.types";
import { stripe } from "@/utils/stripe/config";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin privileges and overwrites RLS policies!
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

const createOrRetrieveUser = async (props: {
  id: string;
  email: string;
  name: string;
}) => {
  const { data: retrievedUser, error: retrieveError } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("id", props.id);

  if (retrievedUser && !retrieveError && retrievedUser.length > 0) {
    return retrievedUser;
  }

  console.log(retrievedUser, retrieveError);
  const { data, error } = await supabaseAdmin
    .from("users")
    .insert({
      id: props.id,
      email: props.email,
      name: props.name,
    })
    .select();
  console.log(data, error);

  if (error) {
    throw new Error(`Supabase customer creation failed: ${error.message}`);
  }

  return data[0];
};

const updateUserPlan = async (props: { userId: string; planId: number }) => {
  const { data, error } = await supabaseAdmin
    .from("users")
    .update({ plan_id: props.planId })
    .eq("id", props.userId)
    .select();

  if (error) {
    throw new Error(`Supabase user update failed: ${error.message}`);
  }

  return data;
};

const updateUserPlanAndReference = async (props: {
  userId: string;
  planId: number;
  stripeReference: string;
}) => {
  const { data, error } = await supabaseAdmin
    .from("users")
    .update({ plan_id: props.planId, stripe_reference: props.stripeReference })
    .eq("id", props.userId)
    .select();

  if (error) {
    throw new Error(`Supabase user update failed: ${error.message}`);
  }

  return data;
};

const fetchUser = async (userId: string) => {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*, plan:plans(*)")
    .eq("id", userId)
    .single();

  if (error) {
    throw new Error(`Supabase user fetch failed: ${error.message}`);
  }

  return data;
};

export {
  createOrRetrieveUser,
  updateUserPlan,
  fetchUser,
  updateUserPlanAndReference,
};
