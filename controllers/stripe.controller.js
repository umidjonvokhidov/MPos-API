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
          },
          unit_amount: item.productId.price * 100,
          images: [item.productId.image],
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
  try {
    console.log("webhook");

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
        const cart = await Cart.findOne({ user: session.metadata.userID });

        if (cart.products) {
          const transaction = new Transaction({
            userID: session.metadata.userID,
            fullname: session.metadata.fullname,
            typeService: session.metadata.typeService,
            products: cart.products.map((p) => ({
              productId: p._id,
              count: p.count,
              price: p.price,
            })),
            tableNumber: session.metadata.tableNumber,
            description: session.metadata.description,
            paymentMethod: session.metadata.paymentMethod,
            paymentStatus: "completed",
            paymentDetails: {
              PaymentId: session.payment_intent,
              receiptUrl: session.receiptUrl,
              gatewayResponse: session,
            },
          });

          await transaction.save();

          if (transaction) {
            console.log("transaction created successfully!");

            if (cart) {
              cart.products = [];
              await cart.save();
            }
          }

          res.status(200).json({
            success: true,
            message: "Created stripe session successfully!",
            data: transaction,
          });
        }
      } catch (error) {
        next(error);
      }
    }
  } catch (error) {
    next(error);
  }
};
