import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
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
    },
  ],
});

cartSchema.virtual("totalPrice").get(function () {
  if (!this.products || this.products.length === 0) return 0;
  return this.products.reduce((sum, item) => {
    const price = item.productId?.price || 0;
    return sum + price * item.count;
  }, 0);
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
