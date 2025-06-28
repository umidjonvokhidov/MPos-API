import Stripe from "stripe";
import { STRIPE_API_KEY } from "./env";

const stripe = Stripe(STRIPE_API_KEY);

const createStripePayout = async () => {
  const payout = await stripe.payout.create({
    amount: 5000,
    currency: "usd",
  });
};
