import { Router } from "express";
import {
  getAllTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactions.controller.js";
import { authorize, requireWaiter } from "../middlewares/auth.middleware.js";

const transactionsRouter = Router();

// All transaction routes require authentication
transactionsRouter.use(authorize);

// Waiter and above can view all transactions
transactionsRouter.get("/", getAllTransactions);

// Users can create transactions (for customers)
transactionsRouter.post("/", createTransaction);

// Users can view their own transactions or waiters can view any
transactionsRouter.get("/:id", getTransaction);

// Waiter and above can update transactions
transactionsRouter.patch("/:id", updateTransaction);

// Admin only can delete transactions
transactionsRouter.delete("/:id", deleteTransaction);

export default transactionsRouter;
