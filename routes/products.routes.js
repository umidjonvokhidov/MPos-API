import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../controllers/products.controller.js";
import { uploadproductPicturePhoto } from "../utils/multer.js";

export const productsRouter = Router();

productsRouter.get("/", getAllProducts);
productsRouter.get("/:id", getProduct);
productsRouter.post(
  "/",
  uploadproductPicturePhoto.single("image"),
  createProduct
);
productsRouter.put(
  "/:id",
  uploadproductPicturePhoto.single("image"),
  updateProduct
);
productsRouter.delete("/:id", deleteProduct);

export default productsRouter;
