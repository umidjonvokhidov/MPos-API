import { STRIPE_WEBHOOK_SECRET } from "../config/env.js";
import stripe from "../config/stripe.js";
import Transaction from "../models/transaction.model.js";

export const createStripeCheckoutSession = async (req, res, next) => {
  try {
    const { user, typeService, cart } = req.body;
    const session = await stripe.checkout.sessions.create({
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/cancel`,
      mode: "payment",
      metadata: {
        userID: user._id.toString(),
        fullname: user.fullname,
        paymentMethod: "Credit Card",
        products: JSON.stringify(cart),
        typeService: typeService,
      },
      line_items: cart.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
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
    });

    console.log(session);
  } catch (error) {
    next(error);
    console.log(error);
  }
};

export const Webhook = async (req, res, next) => {
  try {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      next(error);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      try {
        const products = JSON.parse(session.metadata.products);

        const transaction = new Transaction({
          userID: session.metadata.userID,
          fullname: session.metadata.fullname,
          typeService: session.metadata.typeService,
          products: products.map((p) => ({
            productId: p._id,
            count: p.count,
            price: p.price,
          })),
          paymentMethod: session.metadata.paymentMethod,
          paymentStatus: "completed",
          paymentDetails: {
            PaymentId: session.payment_intent,
            receiptUrl: session.receiptUrl,
            gatewayResponse: session,
          },
        });

        await transaction.save();

        res.status(200).json({
          success: true,
          message: "Created stripe session successfully!",
          data: transaction,
        });
      } catch (error) {
        next(error);
      }
    }
  } catch (error) {
    next(error);
  }
};
