import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { JWT_SECRET } from "../config/env.js";

// Middleware to verify JWT token and attach user to request
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
      const error = new Error("Access denied. No token provided.");
      error.statusCode = 401;
      throw error;
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      const error = new Error("Invalid token. User not found.");
      error.statusCode = 401;
      throw error;
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      error.statusCode = 401;
      error.message = "Invalid token.";
    } else if (error.name === "TokenExpiredError") {
      error.statusCode = 401;
      error.message = "Token expired.";
    }
    next(error);
  }
};

// Role-based authorization middleware
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      const error = new Error("Access denied. User not authenticated.");
      error.statusCode = 401;
      return next(error);
    }

    if (!roles.includes(req.user.role)) {
      const error = new Error(
        `Access denied. Role ${req.user.role} is not authorized to access this resource.`
      );
      error.statusCode = 403;
      return next(error);
    }

    next();
  };
};

// Specific role middlewares for convenience
export const requireAdmin = authorizeRoles("admin");
export const requireChef = authorizeRoles("chef", "admin");
export const requireWaiter = authorizeRoles("waiter", "chef", "admin");

// Middleware to check if user can access their own resource or is admin
export const authorizeOwnResource = (resourceUserIdField = "userID") => {
  return (req, res, next) => {
    if (!req.user) {
      const error = new Error("Access denied. User not authenticated.");
      error.statusCode = 401;
      return next(error);
    }

    // Admin can access any resource
    if (req.user.role === "admin") {
      return next();
    }

    // Check if user is accessing their own resource
    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    
    if (resourceUserId && resourceUserId.toString() !== req.user._id.toString()) {
      const error = new Error("Access denied. You can only access your own resources.");
      error.statusCode = 403;
      return next(error);
    }

    next();
  };
}; 