import { Router } from "express";
import {
  getAllNotifications,
  getNotification,
  createNotification,
  deleteNotification,
  markAllNotificationsRead,
  markNotificationRead,
} from "../controllers/notifications.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const notificationsRouter = Router();

// All notification routes require authentication
notificationsRouter.use(authorize);

// Admin only routes
notificationsRouter.get("/", getAllNotifications);
notificationsRouter.post("/", createNotification);
notificationsRouter.delete("/:id", deleteNotification);

// Users can access their own notifications
notificationsRouter.get("/:id", getNotification);
notificationsRouter.put("/:id", markNotificationRead);
notificationsRouter.post("/mark-all-as-read/:id", markAllNotificationsRead);

export default notificationsRouter;
