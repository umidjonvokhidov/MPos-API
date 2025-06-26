export const getAllNotifications = (req, res, next) => {
  res.json({ success: true, message: "Get All Notifications" });
};

export const getNotification = (req, res, next) => {
  res.json({ success: true, message: "Get Notification", id: req.params.id });
};

export const createNotification = (req, res, next) => {
  const data = req.body;
  res.json({
    success: true,
    data,
    message: "Create Notification",
  });
};

export const updateNotification = (req, res, next) => {
  const data = req.body;
  res.json({
    success: true,
    data,
    message: "Update Notification",
    id: req.params.id,
  });
};

export const deleteNotification = (req, res, next) => {
  res.json({
    success: true,
    message: "Delete Notification",
    id: req.params.id,
  });
};
