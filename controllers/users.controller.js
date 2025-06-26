import User from "../models/user.model.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    if (!users) {
      const error = new Error("There are no users in collection");
      error.statusCode = 404;
      throw error;
    }

    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

export const getUser = (req, res, next) => {
  res.json({ success: true, message: "Get User", id: req.params.id });
};

export const createUser = (req, res, next) => {
  const data = req.body;
  res.json({ success: true, data, message: "Create User" });
};

export const updateUser = (req, res, next) => {
  const data = req.body;
  res.json({ success: true, data, message: "Update User", id: req.params.id });
};

export const deleteUser = (req, res, next) => {
  res.json({ success: true, message: "Delete User", id: req.params.id });
};

export const getUserSettings = (req, res, next) => {
  res.json({ success: true, message: "Get User Settings", id: req.params.id });
};
export const updateUserSettings = (req, res, next) => {
  const data = req.body;
  res.json({
    success: true,
    data,
    message: "Update User Settings",
    id: req.params.id,
  });
};
