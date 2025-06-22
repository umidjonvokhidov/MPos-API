import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name must be less than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      maxlength: [500, "Product description must be less than 500 characters"],
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
    ingredients: {
      type: [String],
      required: [true, "Product ingredients are required"],
    },
    stock: {
      type: Number,
      required: [true, "Product stock is required"],
      min: [0, "Product stock must be greater than 0"],
      default: 0,
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

const Product = mongoose.model("Product", productSchema);

export default Product;
