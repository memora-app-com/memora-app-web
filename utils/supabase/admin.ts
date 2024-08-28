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

export { updateUserPlan };
