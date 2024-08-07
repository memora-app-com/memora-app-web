import { createClient } from "./client";

const supabase = createClient();

const fetchUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("id", userId);

  if (error) throw error;

  return data[0];
};

export { fetchUserProfile };
