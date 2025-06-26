export const getAllProducts = (req, res, next) => {
  res.json({ success: true, message: "Get All Products" });
};

export const getProduct = (req, res, next) => {
  res.json({ success: true, message: "Get Product", id: req.params.id });
};

export const createProduct = (req, res, next) => {
  const data = req.body;
  res.json({ success: true, data, message: "Create Product" });
};

export const updateProduct = (req, res, next) => {
  const data = req.body;
  res.json({ success: true, data, message: "Update Product", id: req.params.id });
};

export const deleteProduct = (req, res, next) => {
  res.json({ success: true, message: "Delete Product", id: req.params.id });
};
