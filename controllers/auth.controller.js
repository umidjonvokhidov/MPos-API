import mongoose from "mongoose";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET, REFRESH_SECRET } from "../config/env.js";

export const SignUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { firstname, lastname, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    const newUsers = await User.create(
      [
        {
          firstname,
          lastname,
          email,
          password,
        },
      ],
      { session }
    );

    const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    const refreshToken = jwt.sign({ id: newUsers[0]._id }, REFRESH_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        token,
        user: newUsers[0],
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const SignIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      const error = new Error("Password is not valid");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshTokenRoute = async (req, res, next) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    const error = new Error("Refresh token expired or deleted");
    error.statusCode = 401;
    throw error;
  }

  try {
    const payload = jwt.verify(token, REFRESH_SECRET);
    const accessToken = jwt.sign({ id: payload.id }, JWT_SECRET, {
      expiresIn: "15m",
    });
    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
};

export const authorize = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      const error = new Error("Unauthorized");
      error.statusCode = 401;
      throw error;
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = user;
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error: error.message });
    next(error);
  }
};

export const SignOut = (req, res, next) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "Strict",
    secure: true,
  });
  res.status(200).json({ success: true, message: "Logged out" });
};

export const GoogleAuth = (req, res, next) => {
  res.json({ success: true, message: "Google Auth" });
};

export const GoogleAuthCallback = (req, res, next) => {
  res.json({ success: true, message: "Google Auth Callback" });
};

export const AppleAuth = (req, res, next) => {
  res.json({ success: true, message: "Apple Auth" });
};
