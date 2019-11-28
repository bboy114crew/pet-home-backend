const User = require("../models/User");

const createUser = async data => {
  try {
    const userExisted = await findUserByFbId(data.facebookId);
    if (userExisted) {
      if (userExisted.deletionFlag === false) {
        return userExisted;
      } else {
        return "Tài khoản này đã bị khóa";
      }
    }
    const user = new User(data);
    const result = await User.create(user);
    return result;
  } catch (error) {
    throw error;
  }
};

const findUserByFbId = async facebookId => {
  try {
    const result = await User.findOne({ facebookId });
    return result;
  } catch (error) {
    throw error;
  }
};

const findUser = async userId => {
  try {
    const result = await User.findById(userId);
    return result;
  } catch (error) {
    throw error;
  }
};

const addExpoToken = async ({ userId, expoToken }) => {
  try {
    const result = await User.findByIdAndUpdate(userId, {
      $set: {
        expoToken,
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

const removeExpoToken = async ({ userId }) => {
  try {
    const result = await User.findByIdAndUpdate(userId, {
      $set: {
        expoToken: null,
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

const addNotification = async ({ userId, notification }) => {
  try {
    const result = await User.findByIdAndUpdate(userId, {
      $push: {
        notifications: notification,
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

const editAppInfo = async ({ userId, updateOption }) => {
  try {
    const result = await User.findByIdAndUpdate(userId, {
      $set: updateOption,
    });
    return result;
  } catch (error) {
    throw error;
  }
};

const getNotifications = async userId => {
  try {
    const result = await User.findById(userId);
    return result.notifications;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  findUserByFbId,
  createUser,
  findUser,
  addExpoToken,
  removeExpoToken,
  addNotification,
  getNotifications,
  editAppInfo,
};
