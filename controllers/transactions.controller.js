import Transaction from "../models/transaction.model.js";

export const getAllTransactions = async (req, res, next) => {
  try {
    let transactions;

    const pipeline = [];

    if (req.query.id) {
      pipeline.push({ $match: { userID: req.params.id } });
    }
    if (req.query.type_service) {
      pipeline.push({ $match: { type_service: req.query.type_service } });
    }
    if (req.query.product_category) {
      pipeline.push({
        $match: { product_category: req.query.product_category },
      });
    }
    if (req.query.status) {
      pipeline.push({ $match: { status: req.query.status } });
    }

    transactions = await Transaction.aggregate(pipeline);

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
