import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import fs from "fs";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    const userCount = await User.find().countDocuments();

    if (!users) {
      const error = new Error("Users not found!");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, count: userCount, data: users });
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

    const user = await User.create(req.body);

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
  if (req.file && req.file.path) {
    req.body.profilePicture = req.file.path;
    const OldUser = await User.findById(req.params.id);
    if (OldUser.profilePicture) {
      const filePath = OldUser.profilePicture;
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

    res.status(200).json({ success: true, data: user.settings,message: `Settings for the user ID: ${user._id}`, });
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
