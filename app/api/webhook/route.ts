import Stripe from "stripe";
import { stripe } from "@/utils/stripe/config";
import { updateUserPlan } from "@/utils/supabase/mutations-server";

const relevantEvents = new Set(["checkout.session.completed"]);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret)
      return new Response("Webhook secret not found.", { status: 400 });
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    console.log(`🔔  Webhook received: ${event.type}`);
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "checkout.session.completed":
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          handleCheckoutSessionCompleted(checkoutSession);
          break;
        default:
          throw new Error("Unhandled relevant event!");
      }
    } catch (error) {
      console.log(error);
      return new Response(
        "Webhook handler failed. View your Next.js function logs.",
        {
          status: 400,
        }
      );
    }
  } else {
    return new Response(`Unsupported event type: ${event.type}`, {
      status: 400,
    });
  }
  return new Response(JSON.stringify({ received: true }));
}

// TODO: move this to a separate file
async function handleCheckoutSessionCompleted(
  checkoutSession: Stripe.Checkout.Session
) {
  console.log("handling");
  if (checkoutSession.mode === "subscription") {
    const userId = checkoutSession.metadata.user_id;
    const planId = checkoutSession.metadata.plan_id;
    console.log(userId, planId);
    await updateUserPlan({ userId: Number(userId), planId: Number(planId) });
  } else if (checkoutSession.mode === "payment") {
    const paymentIntentId = checkoutSession.payment_intent;
    // TODO: implement payment intent handling
  }
}
