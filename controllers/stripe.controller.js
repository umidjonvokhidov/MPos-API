import { STRIPE_WEBHOOK_SECRET } from "../config/env.js";
import stripe from "../config/stripe.js";
import Transaction from "../models/transaction.model.js";
import Cart from "../models/cart.model.js";

export const createStripeCheckoutSession = async (req, res, next) => {
  try {
    const { typeService, products, tableNumber, fullname, description } =
      req.body;

    const cart = await Cart.findOne({
      user: req.user._id.toString(),
    }).populate("products.productId");

    if (cart?.products?.length > 0) {
      const transaction = new Transaction({
        userID: req.user._id.toString(),
        fullname: fullname,
        typeService: typeService,
        products: products.map((p) => ({
          productId: p.productId._id,
          count: p.count,
          price: p.productId.price,
        })),
        tableNumber: tableNumber,
        description: description,
        paymentMethod: "Credit Card",
        paymentStatus: "pending",
      });

      await transaction.save();

      cart.products = [];
      await cart.save();

      const session = await stripe.checkout.sessions.create({
        success_url: `${req.headers.origin}/products?success=true`,
        cancel_url: `${req.headers.origin}/transactions?canceled=true`,
        mode: "payment",
        metadata: {
          transactionId: transaction._id.toString(),
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
          tax_rates: ["txr_1RrdfOQxE7rXLziJNQw8YC8o"],
        })),
        payment_method_types: ["card"],
      });

      res.status(200).json({
        success: true,
        message: "Created stripe session successfully!",
        id: session.id,
        url: session.url,
      });

      if (!session) {
        const error = new Error("Failed to create stripe session");
        error.statusCode = 500;
        throw error;
      }

      console.log("✅ Transaction saved and cart cleared.");
    }
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

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        try {
          const paymentIntent = await stripe.paymentIntents.retrieve(
            session.payment_intent
          );

          if (paymentIntent.status !== "succeeded") {
            console.warn("⚠️ Payment not succeeded yet. Skipping.");
            return res.status(200).send("Payment not completed");
          }

          switch (paymentIntent.status) {
            case "succeeded": {
              const transaction = await Transaction.findByIdAndUpdate(
                session.metadata.transactionId,
                {
                  paymentStatus: "completed",
                  paymentDetails: {
                    PaymentId: session.payment_intent,
                    receiptUrl:
                      paymentIntent?.charges?.data?.[0]?.receipt_url || null,
                    gatewayResponse: session,
                  },
                }
              );

              if (!transaction) {
                console.error("❌ Transaction not found.");
                return res.status(404).send("Transaction not found");
              }
              break;
            }
            case "payment_failed": {
              const transaction = await Transaction.findByIdAndUpdate(
                session.metadata.transactionId,
                {
                  paymentStatus: "failed",
                  paymentDetails: {
                    PaymentId: session.payment_intent,
                    receiptUrl:
                      paymentIntent?.charges?.data?.[0]?.receipt_url || null,
                    gatewayResponse: session,
                  },
                }
              );
              if (!transaction) {
                console.error("❌ Transaction not found.");
                return res.status(404).send("Transaction not found");
              }
              break;
            }
            case "payment_canceled": {
              const transaction = await Transaction.findByIdAndUpdate(
                session.metadata.transactionId,
                {
                  paymentStatus: "canceled",
                }
              );
              if (!transaction) {
                console.error("❌ Transaction not found.");
                return res.status(404).send("Transaction not found");
              }
              break;
            }
          }

          return res.status(200).send("Checkout processed");
        } catch (error) {
          console.error("❌ Error in checkout handling:", error);
          return res.status(500).send("Internal server error.");
        } finally {
          break;
        }
      }
      case "checkout.session.expired": {
        const session = event.data.object;
        const transaction = await Transaction.findByIdAndUpdate(
          session.metadata.transactionId,
          {
            paymentStatus: "failed",
          }
        );
        if (!transaction) {
          console.error("❌ Transaction not found.");
          return res.status(404).send("Transaction not found");
        }
        break;
      }
    }
  } catch (error) {
    console.error("❌ Webhook failed:", error);
    return res.status(500).send("Webhook failure");
  }
};
