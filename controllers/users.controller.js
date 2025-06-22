export const getAllUsers = (req, res, next) => {
  res.json({ success: true, message: "Get All Users" });
};

export const getUser = (req, res, next) => {
  res.json({ success: true, message: "Get User", id: req.params.id });
};

export const createUser = (req, res, next) => {
  res.json({ success: true, message: "Create User" });
};

export const updateUser = (req, res, next) => {
  res.json({ success: true, message: "Update User", id: req.params.id });
};

export const deleteUser = (req, res, next) => {
  res.json({ success: true, message: "Delete User", id: req.params.id });
};

export const getUserSettings = (req, res, next) => {
  res.json({ success: true, message: "Get User Settings", id: req.params.id });
};
export const updateUserSettings = (req, res, next) => {
  res.json({
    success: true,
    message: "Update User Settings",
    id: req.params.id,
  });
};
