import { Router } from "express";
import {
  getAllTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactions.controller.js";

const transactionsRouter = Router();

transactionsRouter.get("/", getAllTransactions);
transactionsRouter.get("/:id", getTransaction);
transactionsRouter.post("/", createTransaction);
transactionsRouter.put("/:id", updateTransaction);
transactionsRouter.delete("/:id", deleteTransaction);

export default transactionsRouter;
