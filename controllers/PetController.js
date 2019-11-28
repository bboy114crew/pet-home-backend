const PetService = require("../services/PetService");

const add = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const ownerId = req.body.ownerId;
    const name = req.body.name;
    const age = req.body.age;
    const breed = req.body.breed;
    const branch = req.body.branch;
    const gender = req.body.gender;
    const description = req.body.description;
    const images = req.body.images;

    const data = {
      ownerId,
      name,
      age,
      breed,
      branch,
      gender,
      description,
      images,
    };

    const result = await PetService.add(data);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const getByUser = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const result = await PetService.getByUser(req.params.userId);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const getPet = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const result = await PetService.getPet(req.params.userId);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const getById = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const result = await PetService.getById(req.params.petId);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const deletePet = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const id = req.body.id;
    const result = await PetService.deletePet(id);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const editPet = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const petId = req.body.petId;
    const updateOptions = req.body.updateOptions;
    const result = await PetService.editPet(petId, updateOptions);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const addUserLikePet = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const petId = req.body.petId;
    const userId = req.body.userId;
    const result = await PetService.addUserLikePet(petId, userId);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const addUserIgnorePet = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const petId = req.body.petId;
    const userId = req.body.userId;
    const result = await PetService.addUserIgnorePet(petId, userId);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const getLikeNumber = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const petId = req.params.petId;
    const result = await PetService.getLikeNumber(petId);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const isLiked = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const petId = req.query.petId;
    const userId = req.query.userId;
    const result = await PetService.isLiked(petId, userId);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const getNotIgnoredPet = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const userId = req.params.userId;
    const result = await PetService.getNotIgnoredPet(userId);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const changeRequestStatus = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const notificationId = req.body.notificationId;
    const status = req.body.status;
    const notification = req.body.notification;
    const result = await PetService.changeRequestStatus(
      notificationId,
      status,
      notification
    );
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
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
