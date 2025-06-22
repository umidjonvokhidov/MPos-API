export const getAllTransactions = (req, res, next) => {
  res.json({ success: true, message: "Get All Transactions" });
};

export const getTransaction = (req, res, next) => {
  res.json({ success: true, message: "Get Transaction", id: req.params.id });
};

export const createTransaction = (req, res, next) => {
  res.json({ success: true, message: "Create Transaction" });
};

export const updateTransaction = (req, res, next) => {
  res.json({ success: true, message: "Update Transaction", id: req.params.id });
};

export const deleteTransaction = (req, res, next) => {
  res.json({ success: true, message: "Delete Transaction", id: req.params.id });
};
