import { Router } from "express";
import {
  getAllNotifications,
  getNotification,
  createNotification,
  updateNotification,
  deleteNotification,
} from "../controllers/notifications.controller.js";

const notificationsRouter = Router();

notificationsRouter.get("/", getAllNotifications);
notificationsRouter.get("/:id", getNotification);
notificationsRouter.post("/", createNotification);
notificationsRouter.put("/:id", updateNotification);
notificationsRouter.delete("/:id", deleteNotification);

export default notificationsRouter;
