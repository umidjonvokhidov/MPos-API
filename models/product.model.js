import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name must be less than 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Product price must be greater than 0"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: ["Drink", "Food", "Dessert", "Stick", "Other"],
    },
    image: {
      type: String,
      required: [true, "Product image is required"],
    },
    stock: {
      type: Boolean,
      required: [true, "Product stock is required"],
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Product creator is required"],
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

productSchema.pre("save", async function () {
  try {
    const Notification = (await import("./notification.model.js")).default;
    if (this.isNew) {
      await Notification.create({
        user: this.createdBy,
        title: "Product created!",
        message: "Your product has been created!",
        type: "system",
      });
    }
  } catch (error) {
    console.log("Error in post-save hook:", error);
  }
});

const Product = mongoose.model("Product", productSchema);

export default Product;
