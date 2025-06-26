export const getAllTransactions = (req, res, next) => {
  res.json({ success: true, message: "Get All Transactions" });
};

export const getTransaction = (req, res, next) => {
  res.json({ success: true, message: "Get Transaction", id: req.params.id });
};

export const createTransaction = (req, res, next) => {
  const data = req.body;
  res.json({ success: true, data, message: "Create Transaction" });
};

export const updateTransaction = (req, res, next) => {
  const data = req.body;
  res.json({ success: true, data, message: "Update Transaction", id: req.params.id });
};

export const deleteTransaction = (req, res, next) => {
  res.json({ success: true, message: "Delete Transaction", id: req.params.id });
};
