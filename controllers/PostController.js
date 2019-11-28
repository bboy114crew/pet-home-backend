const PostService = require("../services/PostService");
const Report = require("../models/Report");
const Post = require("../models/Post");
const User = require("../models/User");

//#region post controller
const add = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const title = req.body.title;
    const ownerId = req.body.ownerId;
    const typeId = req.body.typeId;
    const images = req.body.images;
    const status = req.body.status;

    const data = { title, ownerId, typeId, images, status };

    const result = await PostService.add(data);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const get = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const result = await PostService.get();
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const getByOwnerId = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const ownerId = req.params.ownerId;
    const result = await PostService.getByOwnerId(ownerId);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const getPublicByTypeId = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const typeId = req.params.typeId;
    const result = await PostService.getPublicByTypeId(typeId);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const getById = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const postId = req.params.postId;
    const result = await PostService.findPostById(postId);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const editPost = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const postId = req.body.postId;
    const updateOptions = req.body.updateOptions;
    const result = await PostService.editPost(postId, updateOptions);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const postTextSearch = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const searchString = req.query.title;
    const result = await PostService.postTextSearch(searchString);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const deleteById = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const id = req.body.id;
    const result = await PostService.deleteById(id);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};
//#endregion

//#region images controller
const getImages = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const postId = req.params.postId;
    const result = await PostService.getImages(postId);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const addImages = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const images = req.body.images;
    const postId = req.body.postId;
    const result = await PostService.addImages(postId, images);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const removeImage = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const postId = req.body.postId;
    const imageId = req.body.imageId;
    const result = await PostService.removeImage(postId, imageId);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};
//#endregion

//#region comment
const getComments = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const postId = req.params.postId;
    const result = await PostService.getComments(postId);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const addComment = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const postId = req.body.postId;
    const userCommentId = req.body.userCommentId;
    const content = req.body.content;
    const notification = req.body.notification;
    const data = { userCommentId, content };
    const result = await PostService.addComment(postId, data, notification);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const editComment = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const postId = req.body.postId;
    const id = req.body.id;
    const content = req.body.content;
    const data = { content, id };
    const result = await PostService.editComment(postId, data);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const deleteComment = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const postId = req.body.postId;
    const id = req.body.id;
    const result = await PostService.deleteComment(postId, id);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};
//#endregion

//#region vote
const vote = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const postId = req.body.postId;
    const voterId = req.body.voterId;
    const voteType = req.body.voteType;
    const notification = req.body.notification;
    const data = { voterId, voteType };
    const result = await PostService.vote(postId, data, notification);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const getVoteByType = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const postId = req.query.postId;
    const voteType = req.query.voteType;
    const result = await PostService.getVoteByType(postId, voteType);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

//#endregion

//#region report
const addReport = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const postId = req.body.postId;
    const userReportId = req.body.userReportId;
    const content = req.body.content;
    const data = { userReportId, content };
    const result = await PostService.addReport(postId, data);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const getReports = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const postId = req.params.postId;
    const result = await PostService.getReports(postId);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};
//#endregion

const testNotification = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const result = await PostService.testNotification();
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const temp = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const getPosterById = async id => {
  try {
    let user = await User.findById(id).select("appName _id");
    return user;
  } catch (error) {
    return ReE(res, error, 422);
  }
};
const getPostById = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    let result = await PostService.findPostById(req.params.postId);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

module.exports = {
  add,
  get,
  getById,
  editPost,
  postTextSearch,
  getByOwnerId,
  getPublicByTypeId,
  deleteById,

  ////////////
  getImages,
  addImages,
  removeImage,
  ////////////
  getComments,
  addComment,
  editComment,
  deleteComment,
  ///////////
  vote,
  getVoteByType,
  /////////////
  addReport,
  getReports,
  //
  testNotification,
  //
  getPostById,
};
