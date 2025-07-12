import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../controllers/products.controller.js";
import { uploadproductPicturePhoto } from "../utils/multer.js";
import { authorize, requireChef } from "../middlewares/auth.middleware.js";

export const productsRouter = Router();

// Public routes (no auth required)
productsRouter.get("/:id?", getAllProducts);
productsRouter.get("/:id", getProduct);

// Protected routes (auth required)
productsRouter.use(authorize); // Apply auth to all routes below

// Chef and Admin only routes
productsRouter.post(
  "/",
  requireChef,
  uploadproductPicturePhoto.single("image"),
  createProduct
);
productsRouter.put(
  "/:id",
  requireChef,
  uploadproductPicturePhoto.single("image"),
  updateProduct
);
productsRouter.delete("/:id", requireChef, deleteProduct);

export default productsRouter;
