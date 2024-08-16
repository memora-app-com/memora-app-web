import { redirect } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  const data = await req.formData(); // .json()
  // console.log(data)

  const params: Stripe.Checkout.SessionCreateParams = {
    line_items: [
      {
        price: "price_1Po8fO0282FgAIVoEsYKWzEZ", //dynamic
        quantity: 1,
      },
    ],
    success_url: `${origin}/payment?success`,
    cancel_url: `${origin}/payment?canceled`,
    customer: "cus_QfUAnjRmXkghJc", //dynamic
    allow_promotion_codes: true,
    mode: "payment",
  };

  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.create(params);

  redirect(checkoutSession.url);
}
