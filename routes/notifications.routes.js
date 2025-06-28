import { Router } from "express";
import {
  getAllNotifications,
  getNotification,
  createNotification,
  updateNotification,
  deleteNotification,
  getNotificationByUser,
  markAllNotificationsRead,
} from "../controllers/notifications.controller.js";

const notificationsRouter = Router();

notificationsRouter.get("/", getAllNotifications);
notificationsRouter.get("/:id", getNotification);
notificationsRouter.get("/user/:id", getNotificationByUser);
notificationsRouter.post("/", createNotification);
notificationsRouter.post("/markAllasRead/:id", markAllNotificationsRead);
notificationsRouter.put("/:id", updateNotification);
notificationsRouter.delete("/:id", deleteNotification);

export default notificationsRouter;
