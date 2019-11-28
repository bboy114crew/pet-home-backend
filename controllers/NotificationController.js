const NotificationService = require("../services/NotificationService");

const addNotification = async (req, res) => {
  try {
    const result = await NotificationService.addNotification(req.body);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const getNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await NotificationService.getNotifications(userId);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const getNotificationsByType = async (req, res) => {
  try {
    const userId = req.params.userId;
    const type = req.params.type;
    const result = await NotificationService.getNotificationsByType(
      userId,
      type
    );
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const hiddenNotification = async (req, res) => {
  try {
    const userId = req.body.userId;
    const notificationId = req.body.notificationId;
    const result = await NotificationService.hiddenNotification(
      notificationId,
      userId
    );
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

module.exports = {
  addNotification,
  getNotifications,
  getNotificationsByType,
  hiddenNotification
};
