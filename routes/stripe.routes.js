import { Router } from "express";
import express from "express";
import {
  createStripeCheckoutSession,
} from "../controllers/stripe.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const stripeRouter = Router();

stripeRouter.post(
  "/create-checkout-session",
  authorize,
  createStripeCheckoutSession
);

export default stripeRouter;
