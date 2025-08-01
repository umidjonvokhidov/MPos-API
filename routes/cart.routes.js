import express from "express";
import {
  getUserCartProducts,
  addToUserCart,
  removeFromUserCart,
  clearUserCart,
  removeProductCompletelyFromCart,
} from "../controllers/cart.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const cartRouter = express.Router();

cartRouter.use(authorize);

cartRouter.get("/", getUserCartProducts);

cartRouter.post("/:id/add", addToUserCart);

cartRouter.post("/:id/remove", removeFromUserCart);

cartRouter.post("/clear", clearUserCart);

cartRouter.post("/:id/remove-complete", removeProductCompletelyFromCart);

export default cartRouter;
