import { Router } from "express";
import {
  getAllTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactions.controller.js";
import { authorize, requireWaiter, authorizeOwnResource } from "../middlewares/auth.middleware.js";

const transactionsRouter = Router();

// All transaction routes require authentication
transactionsRouter.use(authorize);

// Waiter and above can view all transactions
transactionsRouter.get("/:id?", requireWaiter, getAllTransactions);

// Users can create transactions (for customers)
transactionsRouter.post("/", createTransaction);

// Users can view their own transactions or waiters can view any
transactionsRouter.get("/:id", authorizeOwnResource("userID"), getTransaction);

// Waiter and above can update transactions
transactionsRouter.put("/:id", requireWaiter, updateTransaction);

// Admin only can delete transactions
transactionsRouter.delete("/:id", requireWaiter, deleteTransaction);

export default transactionsRouter;
