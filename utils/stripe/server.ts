"use server";

import { updateUserPlan } from "../supabase/admin";
import { stripe } from "./config";

export async function fulfillCheckout(sessionId: string) {
  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

  const userId = checkoutSession.metadata.user_id;
  const planId = checkoutSession.metadata.plan_id;
  if (!userId || !planId) {
    throw new Error(
      `User ID or Plan ID not found in metadata for ${checkoutSession.id}`
    );
  }

  if (checkoutSession.payment_status !== "paid") {
    throw new Error(
      `Payment for ${checkoutSession.id} not completed. Payment status: ${checkoutSession.payment_status}`
    );
  }

  await updateUserPlan({ userId: userId, planId: Number(planId) });
}
