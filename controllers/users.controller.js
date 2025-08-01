import User from "../models/user.model.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      const error = new Error("User not found!");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: user,
      message: `User with id: ${user._id}`,
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const createUser = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    if (req.file && req.file.path) {
      req.body.profilePicture = req.file.path;
    }

    const user = new User(req.body);
    await user.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        user: user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  if (req.file && req.file.path) {
    req.body.profilePicture = `${req.protocol}://${req.get("host")}/uploads/users/${req.file.filename}`;

    const oldUser = await User.findById(req.params.id);
    if (oldUser && oldUser.profilePicture) {
      const imageUrl = new URL(oldUser.profilePicture);
      const filename = path.basename(imageUrl.pathname);

      const filePath = path.join(__dirname, "..", "uploads", "users", filename);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    const error = new Error("User not found!");
    error.statusCode = 404;
    throw error;
  }

  res
    .status(200)
    .json({ success: true, data: user, message: "User updated succesfully!" });
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      const error = new Error("User not found!");
      error.statusCode = 404;
      throw error;
    }

    if (user.profilePicture) {
      const filePath = user.profilePicture;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getUserSettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      const error = new Error("User not found!");
      error.statusCode = 404;
      throw error;
    }

    if (!user.settings) {
      const error = new Error("User settings not found!");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: user.settings,
      message: `Settings for the user ID: ${user._id}`,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserSettings = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        settings: req.body,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user.settings) {
      const error = new Error("User settings not found!");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, data: user.settings });
  } catch (error) {
    next(error);
  }
};
