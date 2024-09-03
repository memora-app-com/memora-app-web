import { stripe } from "@/utils/stripe/config";
import { fetchUser, updateUserPlan } from "@/utils/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();
  const userId = data.userId as string;
  const origin = req.headers.get("origin");
  const user = await fetchUser(userId);

  if (user.plan.billing_type === "one_time") {
    const paymentIntents = await stripe.paymentIntents.list({
      customer: user.stripe_reference,
    });
    const sortedPaymentIntents = paymentIntents.data.sort(
      (a, b) => b.created - a.created
    );
    const lastPaymentIntent = sortedPaymentIntents[0];

    await stripe.refunds.create({
      payment_intent: lastPaymentIntent.id,
    });

    updateUserPlan({ userId, planId: 1 });
  } else if (user.plan.billing_type === "monthly") {
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripe_reference,
    });
    const subscription = subscriptions.data[0];

    await stripe.subscriptions.cancel(subscription.id);

    updateUserPlan({ userId, planId: 1 });
  }

  return NextResponse.json({ url: origin });
}
