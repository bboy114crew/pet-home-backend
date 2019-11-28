const Pet = require("./../models/Pet");
const Notification = require("../models/Notification");
const ExpoService = require("./ExpoService");

const add = async data => {
  try {
    const pet = new Pet(data);
    const result = await pet.save();
    return result;
  } catch (error) {
    throw error;
  }
};

const getByUser = async userId => {
  try {
    const result = await Pet.find({ ownerId: userId }).select({
      likes: 0,
      ignores: 0,
    });
    return result;
  } catch (error) {
    throw error;
  }
};

const getPet = async (userId = "") => {
  try {
    const result = await Pet.find({ ownerId: { $ne: userId } });
    return result;
  } catch (error) {
    throw error;
  }
};

const getById = async petId => {
  try {
    const result = await Pet.findById(petId).select({ likes: 0, ignores: 0 });
    return result;
  } catch (error) {
    throw error;
  }
};

const deletePet = async _id => {
  try {
    const result = await Pet.findByIdAndRemove(_id);
    return result;
  } catch (error) {
    throw error;
  }
};

const editPet = async (petId, updateOptions) => {
  try {
    const options = {};
    for (const opt of updateOptions) {
      options[opt.propName] = opt.value;
    }
    const result = await Pet.findByIdAndUpdate(
      petId,
      {
        $set: options,
      },
      {
        new: true,
      }
    );
    return result;
  } catch (error) {
    throw error;
  }
};

const addUserLikePet = async (petId, userId) => {
  try {
    const liked = await isLiked(petId, userId);
    if (liked) return await unlike(petId, userId);
    const result = await Pet.findByIdAndUpdate(petId, {
      $push: {
        likes: {
          user: userId,
        },
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

const unlike = async (petId, userId) => {
  try {
    const result = await Pet.findByIdAndUpdate(petId, {
      $pull: {
        likes: {
          user: userId,
        },
      },
    });
    return result;
  } catch (error) {}
};

const isLiked = async (petId, userId) => {
  try {
    const result = await Pet.findById(petId, {
      likes: {
        $elemMatch: {
          user: userId,
        },
      },
    });
    return result.likes[0];
  } catch (error) {
    throw error;
  }
};

const addUserIgnorePet = async (petId, userId) => {
  try {
    const result = await Pet.findByIdAndUpdate(petId, {
      $push: {
        ignores: {
          user: userId,
        },
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

const getLikeNumber = async petId => {
  try {
    const result = await Pet.findById(petId);
    return result.likes.length;
  } catch (error) {
    throw error;
  }
};

const getNotIgnoredPet = async userId => {
  try {
    const result = await Pet.find({
      $and: [
        {
          "ignores.user": { $ne: userId },
        },
        {
          ownerId: { $ne: userId },
        },
      ],
    })
      .populate("ownerId", { deletionFlag: 1, _id: 1 })
      .sort({ likes: -1 });
    return filterUserBanned(result);
  } catch (error) {
    throw error;
  }
};

const filterUserBanned = (pets = []) => {
  return pets.filter(p => p.ownerId.deletionFlag === false);
};

const changeRequestStatus = async (notificationId, status, notification) => {
  try {
    ExpoService.sendNotifications(notification);
    const result = await Notification.findByIdAndUpdate(
      {
        _id: notificationId,
      },
      {
        $set: {
          "content.status": status,
        },
      }
    );
    await changeMessage(notificationId, notification.data.message);
    return result;
  } catch (error) {
    throw error;
  }
};

const changeMessage = async (notificationId, message) => {
  try {
    const result = await Notification.findByIdAndUpdate(
      {
        _id: notificationId,
      },
      {
        $set: {
          message,
        },
      }
    );
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  add,
  getByUser,
  getPet,
  getById,
  deletePet,
  editPet,
  isLiked,
  addUserLikePet,
  addUserIgnorePet,
  getLikeNumber,
  getNotIgnoredPet,
  changeRequestStatus,
};
