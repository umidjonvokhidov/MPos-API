import Transaction from "../models/transaction.model.js";

export const getAllTransactions = async (req, res, next) => {
  try {
    const match = {};

    if (req.query.id) match.userID = req.query.id;
    if (req.query.type_service) match.type_service = req.query.type_service;
    if (req.query.product_category)
      match.product_category = req.query.product_category;
    if (req.query.status) match.status = req.query.status;

    const pipeline = [];

    if (Object.keys(match).length > 0) {
      pipeline.push({ $match: match });
    }

    const transactions = await Transaction.aggregate(pipeline);

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
    const transaction = new Transaction(req.body);
    await transaction.save();

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
