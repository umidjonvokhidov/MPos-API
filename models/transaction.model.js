import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    customer: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    typeService: {
      type: String,
      enum: ["Delivery", "Take Away", "Dine In"],
      default: "Dine In",
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Total price must be greater than 0"],
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
      enum: ["Credit Card", "PayPal", "Cash", "Apple Pay", "Google Pay"],
      required: [true, "Payment method is required"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentDetails: {
      stripePaymentId: { type: String },
      receiptUrl: { type: String },
      gatewayResponse: { type: Object },
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



const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
