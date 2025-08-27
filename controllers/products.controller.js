import Product from "../models/product.model.js";
import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

export const getAllProducts = async (req, res, next) => {
  try {
    let products;

    if (req.query.id) {
      products = (await Product.find({ createdBy: req.query.id })).sort({
        createdAt: -1,
      });
    } else {
      products = await Product.find().sort({
        createdAt: -1,
      });
    }

    if (!products) {
      const error = new Error("Products not found!");
      error.statusCode = 404;
      throw error;
    }

    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      const error = new Error("Product with this ID not found!");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    if (req.file && req.file.path) {
      req.body.image = `${req.protocol}://${req.get("host")}/uploads/products/${req.file.filename}`;
    }
    if (req.user && req.user._id) {
      req.body.createdBy = req.user._id;
    }
    console.log(req.body);

    const product = new Product(req.body);
    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully!",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  try {
    if (req.file && req.file.path) {
      req.body.image = `${req.protocol}://${req.get("host")}/uploads/products/${req.file.filename}`;

      const oldProduct = await Product.findById(req.params.id);
      if (oldProduct && oldProduct.image) {
        const imageUrl = new URL(oldProduct.image);
        const filename = path.basename(imageUrl.pathname);

        const filePath = path.join(
          __dirname,
          "..",
          "uploads",
          "products",
          filename
        );

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      const error = new Error("Product with this ID not found!");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      const error = new Error("Product with this ID not found!");
      error.statusCode = 404;
      throw error;
    }

    if (product.image) {
      const imageUrl = new URL(product.image);
      const filename = path.basename(imageUrl.pathname);
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);

      const filePath = path.join(
        __dirname,
        "..",
        "uploads",
        "products",
        filename
      );

      await fs.unlink(filePath).catch(() => {
        console.warn(`⚠️ File not found, skipping delete: ${filePath}`);
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};
