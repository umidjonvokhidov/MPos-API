import { Router } from "express";
import { createStripeCheckoutSession } from "../controllers/stripe.controller.js";

const stripeRouter = Router();

stripeRouter.post("/create-checkout-session", createStripeCheckoutSession);

export default stripeRouter;
