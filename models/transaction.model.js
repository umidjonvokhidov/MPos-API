import mongoose from "mongoose";
import Notification from "./notification.model.js";

const transactionSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    fullname: {
      type: String,
      required: [true, "Fullname is required"],
      maxlength: [100, "Fullname must be less than 100 characters"],
    },
    typeService: {
      type: String,
      enum: ["Delivery", "Take Away", "Dine In"],
      default: "Dine In",
    },
    tableNumber: {
      type: Number,
      required: [true, "Table Number is required"]
    },
    status: {
      type: String,
      enum: ["pending", "completed", "declined"],
      default: "pending",
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Products are required"],
        },
        count: {
          type: Number,
          required: [true, "Product count is required"],
          min: [1, "Count must be at least 1"],
        },
        price: {
          type: Number,
          required: [true, "Product price is required"],
          min: [0, "Price must be greater than 0"],
        },
      },
    ],
    paymentMethod: {
      type: String,
      enum: ["Credit Card", "Cash", "Google Pay"],
      required: [true, "Payment method is required"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentDetails: {
      PaymentId: { type: String },
      receiptUrl: { type: String },
      gatewayResponse: mongoose.Schema.Types.Mixed,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

transactionSchema.virtual("totalPrice").get(function () {
  if (!this.products || this.products.length === 0) return 0;
  return this.products.reduce((sum, item) => {
    return sum + item.price * item.count;
  }, 0);
});

transactionSchema.pre("save", async function (next) {
  if (this.isModified("status")) {
    const statusMessages = {
      pending: "Your order is being processed",
      completed: "Your order has been completed successfully!",
      declined: "Your order has been declined",
    };

    const statusTitles = {
      pending: "Order Processing",
      completed: "Order Completed",
      declined: "Order Declined",
    };

    await Notification.create({
      user: this.userID,
      title: statusTitles[this.status] || "Order Status Update",
      message:
        statusMessages[this.status] ||
        `Your order status has been updated to ${this.status}`,
      type: "order_status",
    });
  }

  next();
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
