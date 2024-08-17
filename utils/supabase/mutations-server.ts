import { createClient } from "./server";

const supabase = createClient();

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

export { updateUserPlan };
