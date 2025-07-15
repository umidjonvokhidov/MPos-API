import express from "express";
import {
  getUserCartProducts,
  addToUserCart,
  removeFromUserCart,
  clearUserCart,
  removeProductCompletelyFromCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/:id", getUserCartProducts);

router.post("/:id/add", addToUserCart);

router.post("/:id/remove", removeFromUserCart);

router.post("/:id/clear", clearUserCart);

router.post("/:id/remove-complete", removeProductCompletelyFromCart);

export default router;
