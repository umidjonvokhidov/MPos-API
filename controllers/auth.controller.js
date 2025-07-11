import mongoose from "mongoose";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET, REFRESH_SECRET } from "../config/env.js";
import otpGenerator from "otp-generator";
import crypto from "crypto";
import { sendMail } from "../utils/email.js";

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
      {
        firstname,
        lastname,
        email,
        password,
      },

      { session }
    );

    const token = jwt.sign({ id: newUsers._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    const refreshToken = jwt.sign({ id: newUsers._id }, REFRESH_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
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

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
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
    res.status(200).json({ accessToken });
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

    const user = await User.findById(decoded.id);

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error: error.message });
    next(error);
  }
};


export const SignOut = (req, res, next) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.status(200).json({ success: true, message: "Logged out" });
};

export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    user.resetOTP = hashedOTP;
    user.resetOTPExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendMail(
      user.email,
      "Your OTP Code",
      `<h3>Your OTP code is <strong>${otp}</strong></h3><p>This code expires in 10 minutes.</p>`
    );

    res.status(200).json({
      success: true,
      message: `OTP send to email ${user.email}`,
    });
  } catch (error) {
    next(error);
  }
};
export const resetPassword = async (req, res, next) => {
  const { email, otp, newPassword } = req.body;

  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

  try {
    const user = await User.findOne({
      email,
      resetOTP: hashedOTP,
      resetOTPExpires: { $gt: Date.now() },
    });

    if (!user) {
      const error = new Error("OTP invalid or expired!");
      error.statusCode = 404;
      throw error;
    }

    user.password = newPassword;
    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    next(error);
  }
};

export const OAuthCallback = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication failed' });
  }
  const token = jwt.sign({ id: req.user._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
  const refreshToken = jwt.sign({ id: req.user._id }, REFRESH_SECRET, {
    expiresIn: '7d',
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  
  res.redirect(`http://localhost:3000?token=${token}`);
};
