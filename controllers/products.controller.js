import Product from "../models/product.model.js";
import fs from "fs";

export const getAllProducts = async (req, res, next) => {
  try {
    
    let products;

    if(req.params.id) {
      products = await Product.find({createdBy: req.params.id});
    } else {
      products = await Product.find();
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
      req.body.image = req.file.path;
    }
    const product = await Product.create(req.body);

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
  try {
    if (req.file && req.file.path) {
      req.body.image = req.file.path;
      const OldProduct = await Product.findById(req.params.id);
      if (OldProduct.image) {
        const filePath = OldProduct.image;
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

    if (product.image) {
      const filePath = product.image;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    if (!product) {
      const error = new Error("Product with this ID not found!");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};
