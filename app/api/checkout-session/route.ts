import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  const data = await req.json();
  const plan_stripe_reference = data.plan_stripe_reference as string;
  const plan_id = data.plan_id as number;
  const user_stripe_reference = data.user_stripe_reference as string;
  const email = data.email as string;
  const user_id = data.user_id as number;
  const billing_type = data.billing_type as string;

  const params: Stripe.Checkout.SessionCreateParams = {
    line_items: [
      {
        price: plan_stripe_reference,
        quantity: 1,
      },
    ],
    success_url: `${origin}/after-checkout/{CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/plans?canceled=true`,
    allow_promotion_codes: true,
    mode: billing_type === "one_time" ? "payment" : "subscription",
    metadata: {
      user_id: user_id,
      plan_id: plan_id,
    },
  };

  if (user_stripe_reference) {
    params.customer = user_stripe_reference;
  } else if (email) {
    params.customer_email = email;
  }

  if (billing_type === "one_time") {
    params.customer_creation = "always";
  }

  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.create(params);

  return NextResponse.json({ url: checkoutSession.url });
}
