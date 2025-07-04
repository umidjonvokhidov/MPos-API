import Transaction from "../models/transaction.model.js";

export const getAllTransactions = async (req, res, next) => {
  try {
    const filter = {};

    const { type_service, product_category } = req.query;

    const transactions = await Transaction.find();

    res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

export const getTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      const error = new Error("Transaction not found for this ID");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

export const createTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.create(req.body);

    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!transaction) {
      const error = new Error("Transaction not found for this ID");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Transaction updated successfully!",
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);

    if (!transaction) {
      const error = new Error("Transaction not found for this ID");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};
