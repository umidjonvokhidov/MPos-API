import { STRIPE_WEBHOOK_SECRET } from "../config/env.js";
import stripe from "../config/stripe.js";
import Transaction from "../models/transaction.model.js";
import Cart from "../models/cart.model.js";

export const createStripeCheckoutSession = async (req, res, next) => {
  try {
    const { typeService, products, tableNumber, fullname, description } =
      req.body;
    const session = await stripe.checkout.sessions.create({
      success_url: `${req.headers.origin}/checkout/success`,
      cancel_url: `${req.headers.origin}/checkout/cancel`,
      mode: "payment",
      metadata: {
        userID: req.user._id.toString(),
        fullname: fullname,
        paymentMethod: "Credit Card",
        typeService: typeService,
        description: description,
        tableNumber: tableNumber,
      },

      line_items: products.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.productId.name,
            images: [item.productId.image],
          },
          unit_amount: Math.round(item.productId.price * 100),
        },
        quantity: item.count,
      })),
      payment_method_types: ["card"],
    });

    if (!session) {
      const error = new Error("Failed to create stripe session");
      error.statusCode = 500;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Created stripe session successfully!",
      id: session.id,
      session: session,
    });

    console.log(session);
  } catch (error) {
    next(error);
    console.log(error);
  }
};
export const Webhook = async (req, res, next) => {
  let event;

  try {
    const sig = req.headers["stripe-signature"];

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      console.error("❌ Invalid webhook signature.");
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(
          session.payment_intent
        );

        if (paymentIntent.status !== "succeeded") {
          console.warn("⚠️ Payment not succeeded yet. Skipping.");
          return res.status(200).send("Payment not completed");
        }

        const cart = await Cart.findOne({
          user: session.metadata.userID,
        }).populate("products.productId");

        if (cart?.products?.length > 0) {
          const transaction = new Transaction({
            userID: session.metadata.userID,
            fullname: session.metadata.fullname,
            typeService: session.metadata.typeService,
            products: cart.products.map((p) => ({
              productId: p.productId._id,
              count: p.count,
              price: p.productId.price,
            })),
            tableNumber: session.metadata.tableNumber,
            description: session.metadata.description,
            paymentMethod: session.metadata.paymentMethod,
            paymentStatus: "completed",
            paymentDetails: {
              PaymentId: session.payment_intent,
              receiptUrl:
                paymentIntent?.charges?.data?.[0]?.receipt_url || null,
              gatewayResponse: session,
            },
          });

          await transaction.save();

          cart.products = [];
          await cart.save();

          console.log("✅ Transaction saved and cart cleared.");
        } else {
          console.warn("🛒 Cart is empty or not found.");
        }

        return res.status(200).send("Checkout processed");
      } catch (error) {
        console.error("❌ Error in checkout handling:", error);
        return res.status(500).send("Internal server error.");
      }
    } else {
      return res.status(200).send("Event ignored");
    }
  } catch (error) {
    console.error("❌ Webhook failed:", error);
    return res.status(500).send("Webhook failure");
  }
};
