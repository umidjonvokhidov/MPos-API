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

cartRouter.post("/add", addToUserCart);

cartRouter.post("/remove", removeFromUserCart);

cartRouter.post("/clear", clearUserCart);

cartRouter.post("/remove-complete", removeProductCompletelyFromCart);

export default cartRouter;
