import { Router } from "express";
import express from "express";
import {
  createStripeCheckoutSession,
  Webhook,
} from "../controllers/stripe.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const stripeRouter = Router();

stripeRouter.post(
  "/create-checkout-session",
  authorize,
  createStripeCheckoutSession
);

stripeRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  Webhook
);

export default stripeRouter;
