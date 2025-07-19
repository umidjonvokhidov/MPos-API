import Stripe from "stripe";
import { STRIPE_API_KEY } from "./env.js";

const stripe = new Stripe(STRIPE_API_KEY);

export default stripe;
