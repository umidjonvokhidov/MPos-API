import Notification from "../models/notification.model.js";

export const getAllNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find();

    if (!notifications) {
      const error = new Error("Notifications not found!");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

export const getNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      const error = new Error("Notification not found for this id");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }

  res.json({ success: true, message: "Get Notification", id: req.params.id });
};

export const getNotificationByUser = async (req, res, next) => {
  try {
    const userNotifications = await Notification.find({ user: req.params.id });

    if (!userNotifications) {
      const error = new Error("Notifications not found for this User");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, data: userNotifications });
  } catch (error) {
    next(error);
  }
};

export const createNotification = async (req, res, next) => {
  try {
    const notification = await Notification.create(req.body);

    res.status(201).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

export const updateNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!notification) {
      const error = new Error("Notification not found for this id");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Notification updated successfully",
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      const error = new Error("Notification not found for this id");
      error.statusCode = 404;
      throw error;
    }

    res
      .status(200)
      .json({ success: true, message: "Notification deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const markAllNotificationsRead = async (req, res, next) => {
  try {
    const notifications = await Notification.updateMany(
      { user: req.params.id, status: "unread" },
      { $set: { status: "read" } }
    );

    if (!notifications) {
      const error = new Error(
        "Unread notifications not found all notifications are read!"
      );
      error.statusCode = 404;
      throw error;
    }

    res
      .status(200)
      .json({ success: true, message: "All Notifications are read!" });
  } catch (error) {
    next(error);
  }
};
