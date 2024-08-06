import { createClient } from "@supabase/supabase-js";
// import type { Database } from "types_db";

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin privileges and overwrites RLS policies!
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

const createOrRetrieveUser = async ({
  uuid,
  email,
  name = "John Doe",
}: {
  uuid: string;
  email: string;
  name?: string;
}) => {
  // Check if the customer already exists in Supabase
  const { data: existingSupabaseCustomer, error: queryError } =
    await supabaseAdmin.from("users").select("*").eq("id", uuid).maybeSingle();

  if (queryError) {
    console.log(queryError.message);
    throw new Error(`Supabase customer lookup failed: ${queryError.message}`);
  }

  if (existingSupabaseCustomer) {
    return existingSupabaseCustomer;
  }

  const { data, error } = await supabaseAdmin
    .from("users")
    .insert({
      id: uuid,
      email: email,
      name: name,
    })
    .select();

  if (error) {
    throw new Error(`Supabase customer creation failed: ${error.message}`);
  }

  return data;

  // TODO: Stripe subscription implementation
  // Retrieve the Stripe customer ID using the Supabase customer ID, with email fallback
  // let stripeCustomerId: string | undefined;
  // if (existingSupabaseCustomer?.stripe_customer_id) {
  //   const existingStripeCustomer = await stripe.customers.retrieve(
  //     existingSupabaseCustomer.stripe_customer_id
  //   );
  //   stripeCustomerId = existingStripeCustomer.id;
  // } else {
  //   // If Stripe ID is missing from Supabase, try to retrieve Stripe customer ID by email
  //   const stripeCustomers = await stripe.customers.list({ email: email });
  //   stripeCustomerId =
  //     stripeCustomers.data.length > 0 ? stripeCustomers.data[0].id : undefined;
  // }

  // If still no stripeCustomerId, create a new customer in Stripe
  // const stripeIdToInsert = stripeCustomerId
  //   ? stripeCustomerId
  //   : await createCustomerInStripe(uuid, email);
  // if (!stripeIdToInsert) throw new Error("Stripe customer creation failed.");

  // if (existingSupabaseCustomer && stripeCustomerId) {
  //   // If Supabase has a record but doesn't match Stripe, update Supabase record
  //   if (existingSupabaseCustomer.stripe_customer_id !== stripeCustomerId) {
  //     const { error: updateError } = await supabaseAdmin
  //       .from("customers")
  //       .update({ stripe_customer_id: stripeCustomerId })
  //       .eq("id", uuid);

  //     if (updateError)
  //       throw new Error(
  //         `Supabase customer record update failed: ${updateError.message}`
  //       );
  //     console.warn(
  //       `Supabase customer record mismatched Stripe ID. Supabase record updated.`
  //     );
  //   }
  //   // If Supabase has a record and matches Stripe, return Stripe customer ID
  //   return stripeCustomerId;
  // } else {
  //   console.warn(
  //     `Supabase customer record was missing. A new record was created.`
  //   );

  //   // If Supabase has no record, create a new record and return Stripe customer ID
  //   const upsertedStripeCustomer = await upsertCustomerToSupabase(
  //     uuid,
  //     stripeIdToInsert
  //   );
  //   if (!upsertedStripeCustomer)
  //     throw new Error("Supabase customer record creation failed.");

  //   return upsertedStripeCustomer;
  // }
};

const createEvent = async ({
  name,
  description,
  code,
  startDate,
  endDate,
  userId,
}: {
  name: string;
  description: string;
  code: string;
  startDate: Date;
  endDate: Date;
  userId: string;
}) => {
  const { data, error } = await supabaseAdmin
    .from("events")
    .insert([
      {
        name,
        description,
        code,
        start_date: startDate,
        end_date: endDate,
        host_id: userId,
      },
    ])
    .select();

  if (error) {
    throw new Error(`Supabase event creation failed: ${error.message}`);
  }

  console.log(data);
  return data;
};

export { createOrRetrieveUser, createEvent };
