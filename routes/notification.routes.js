import { Router } from "express";
import {
  getAllNotifications,
  getNotification,
  createNotification,
  deleteNotification,
  markAllNotificationsRead,
  markNotificationRead,
} from "../controllers/notifications.controller.js";
import {
  authorize,
  requireAdmin,
  authorizeOwnResource,
} from "../middlewares/auth.middleware.js";

const notificationsRouter = Router();

// All notification routes require authentication
notificationsRouter.use(authorize);

// Admin only routes
notificationsRouter.get("/", requireAdmin, getAllNotifications);
notificationsRouter.post("/", requireAdmin, createNotification);
notificationsRouter.delete("/:id", requireAdmin, deleteNotification);

// Users can access their own notifications
notificationsRouter.get("/:id", authorizeOwnResource("user"), getNotification);
notificationsRouter.put(
  "/:id",
  authorizeOwnResource("user"),
  markNotificationRead
);
notificationsRouter.post(
  "/markAllasRead/:id",
  authorizeOwnResource("id"),
  markAllNotificationsRead
);

export default notificationsRouter;
