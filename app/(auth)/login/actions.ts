"use server";

import { createClient } from "@/utils/supabase/server";

export async function login(props: { email: string; password: string }) {
  const supabase = createClient();

  //TODO: Add form validation but inside the client component

  const { error } = await supabase.auth.signInWithPassword({
    email: props.email as string,
    password: props.password as string,
  });

  if (error) {
    return {
      status: 400,
      error: error.message,
    };
  }

  return { status: 200 };
}

export async function signup(props: {
  name: string;
  email: string;
  password: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email: props.email,
    password: props.password,
    options: { data: { full_name: props.name } },
  });

  if (error) {
    return {
      status: 400,
      error: error.message,
    };
  }

  return { status: 200 };
}
