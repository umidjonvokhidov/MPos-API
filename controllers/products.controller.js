export const getAllProducts = (req, res, next) => {
  res.json({ success: true, message: "Get All Products" });
};

export const getProduct = (req, res, next) => {
  res.json({ success: true, message: "Get Product", id: req.params.id });
};

export const createProduct = (req, res, next) => {
  res.json({ success: true, message: "Create Product" });
};

export const updateProduct = (req, res, next) => {
  res.json({ success: true, message: "Update Product", id: req.params.id });
};

export const deleteProduct = (req, res, next) => {
  res.json({ success: true, message: "Delete Product", id: req.params.id });
};
