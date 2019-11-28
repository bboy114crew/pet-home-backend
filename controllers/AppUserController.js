const AppUserService = require("../services/AppUserService");

const createUser = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const facebookId = req.body.facebookId;
    const appName = req.body.appName;
    const avatar = req.body.avatar;
    const role = req.body.role;
    const data = {
      facebookId,
      appName,
      avatar,
      role,
    };
    const result = await AppUserService.createUser(data);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const findUserByFbId = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const result = await AppUserService.findUserByFbId(req.body.facebookId);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const findUser = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const userId = req.params.userId;
    const result = await AppUserService.findUser(userId);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const addExpoToken = async (req, res) => {
  try {
    const result = await AppUserService.addExpoToken(req.body);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const removeExpoToken = async (req, res) => {
  try {
    const result = await AppUserService.removeExpoToken(req.body);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const addNotification = async (req, res) => {
  try {
    const result = await AppUserService.addNotification(req.body);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const getNotifications = async (req, res) => {
  try {
    const result = await AppUserService.getNotifications(req.params.userId);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const editAppInfo = async (req, res) => {
  try {
    const result = await AppUserService.editAppInfo(req.body);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

module.exports = {
  createUser,
  addExpoToken,
  findUser,
  removeExpoToken,
  findUserByFbId,
  addNotification,
  getNotifications,
  editAppInfo
};
