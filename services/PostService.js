const Post = require("../models/Post");
const ExpoService = require("./ExpoService");
const AppUserService = require("./AppUserService");
const mongoose = require("mongoose");
const ReportService = require("../services/ReportService");
const Report = require("../models/Report");
const NotificationService = require("./NotificationService");

//#region post controller
const add = async data => {
  try {
    const post = new Post({ ...data });
    const result = await post.save();
    return result;
  } catch (error) {
    throw error;
  }
};

// get public post only
const get = async () => {
  try {
    const result = await Post.find({
      status: { $eq: 1 },
      deletionFlag: false,
    })
      .select({ votes: 0, comments: 0, reports: 0 })
      .populate("ownerId", {
        _id: 1,
        appName: 1,
        avatar: 1,
        expoToken: 1,
        deletionFlag: 1,
      })
      .sort({ _id: -1 });
    return filterUserBanned(result);
  } catch (error) {
    throw error;
  }
};

const filterUserBanned = (posts = []) => {
  return posts.filter(p => p.ownerId.deletionFlag === false);
};

// const get = async () => {
//  get private post
//   try {
//     const result = await Post.find({ status: { $eq: 0 } }).sort({ _id: -1 });
//     if (result) return result;
//     throw "Get all post failed";
//   } catch (error) {
//     throw error;
//   }
// };

const getPublicByTypeId = async typeId => {
  try {
    const result = await Post.find({
      $and: [{ typeId }, { status: 1 }, { deletionFlag: false }],
    })
      .select({ votes: 0, comments: 0, reports: 0 })
      .populate("ownerId", {
        _id: 1,
        appName: 1,
        avatar: 1,
        expoToken: 1,
        deletionFlag: 1,
      })
      .sort({ _id: -1 });
    return filterUserBanned(result);
  } catch (error) {
    throw error;
  }
};

const getByOwnerId = async ownerId => {
  try {
    const result = await Post.find({ ownerId, deletionFlag: false })
      .select({ votes: 0, comments: 0, reports: 0 })
      .populate("ownerId", {
        _id: 1,
        appName: 1,
        avatar: 1,
        expoToken: 1,
        deletionFlag: 1,
      })
      .sort({ _id: -1 });
    console.log(result);
    return filterUserBanned(result);
  } catch (error) {
    throw error;
  }
};

const editPost = async (postId, updateOptions) => {
  try {
    const options = {};
    for (const opt of updateOptions) {
      options[opt.propName] = opt.value;
    }
    const result = await Post.findByIdAndUpdate(
      postId,
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

const deleteById = async _id => {
  try {
    const result = await Post.findByIdAndRemove(_id);
    return result;
  } catch (error) {
    throw error;
  }
};

const findPostById = async postId => {
  try {
    const post = await Post.findById(postId)
      .select({ votes: 0, comments: 0 })
      .populate("ownerId", { _id: 1, appName: 1, avatar: 1, expoToken: 1 });
    return post;
  } catch (error) {
    throw error;
  }
};

const postTextSearch = async searchString => {
  try {
    const result = await Post.find({
      $text: {
        $search: searchString,
      },
      deletionFlag: false,
    })
      .select({ votes: 0, comments: 0, reports: 0 })
      .populate("ownerId", { _id: 1, appName: 1, avatar: 1, deletionFlag: 1 })
      .sort({ _id: -1 });
    return filterUserBanned(result);
  } catch (error) {
    throw error;
  }
};

//#endregion

//#region post image controller
const getImages = async postId => {
  try {
    const result = await Post.findById(postId);
    result.images;
  } catch (error) {
    throw error;
  }
};

const addImages = async (postId, images) => {
  try {
    const result = await Post.findByIdAndUpdate(postId, {
      $push: {
        images,
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

const removeImage = async (postId, imageId) => {
  try {
    const result = await Post.findByIdAndUpdate(postId, {
      $pull: {
        images: {
          _id: imageId,
        },
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};
//#endregion

//#region comment controller
const getComments = async postId => {
  try {
    const result = await Post.findById(postId).populate(
      "comments.userCommentId",
      {
        _id: 1,
        appName: 1,
        avatar: 1,
      }
    );
    return result.comments;
  } catch (error) {
    throw error;
  }
};

const addComment = async (postId, comment, notification) => {
  try {
    NotificationService.addNotification(notification);
    const result = await Post.findByIdAndUpdate(postId, {
      $push: { comments: { ...comment } },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

const editComment = async (postId, comment) => {
  try {
    const result = await Post.findOneAndUpdate(
      {
        _id: postId,
        comments: {
          $elemMatch: {
            _id: comment.id,
          },
        },
      },
      {
        $set: {
          "comments.$.content": comment.content,
        },
      }
    );
    return result;
  } catch (error) {
    throw error;
  }
};

const deleteComment = async (postId, commentId) => {
  try {
    const result = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: {
          comments: {
            _id: commentId,
          },
        },
      },
      {
        new: false,
      }
    );
    return result;
  } catch (error) {
    throw error;
  }
};
//#endregion

//#region vote controller
const findVote = async (postId, voterId) => {
  try {
    const result = await Post.findById(postId, {
      votes: {
        $elemMatch: {
          voterId,
        },
      },
    });
    return result.votes[0];
  } catch (error) {
    throw error;
  }
};

const getVoteByType = async (postId, voteType) => {
  try {
    const result = await Post.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(postId),
        },
      },
      {
        $project: {
          votes: {
            $filter: {
              input: "$votes",
              as: "vote",
              cond: { $eq: ["$$vote.voteType", parseInt(voteType)] },
            },
          },
        },
      },
    ]);
    return result[0].votes;
  } catch (error) {
    throw error;
  }
};

const vote = async (postId, newVote, notification) => {
  try {
    const oldVote = await findVote(postId, newVote.voterId);
    if (!oldVote) {
      const result = await addVote(postId, newVote);
      await NotificationService.addNotification(notification);
      return result;
    } else {
      if (newVote.voteType === oldVote.voteType) {
        return await removeVote(postId, newVote.voterId);
      } else {
        const result = await editVote(postId, newVote);
        await NotificationService.addNotification(notification);
        return result;
      }
    }
  } catch (error) {
    throw error;
  }
};

const addVote = async (postId, vote) => {
  try {
    const result = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          votes: vote,
        },
      },
      {
        new: false,
      }
    );
    return result;
  } catch (error) {
    throw error;
  }
};

const removeVote = async (postId, voterId) => {
  try {
    const result = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: {
          votes: {
            voterId,
          },
        },
      },
      {
        new: false,
      }
    );
    return result;
  } catch (error) {
    throw error;
  }
};

const editVote = async (postId, vote) => {
  try {
    const result = await Post.findOneAndUpdate(
      {
        _id: postId,
        votes: {
          $elemMatch: {
            voterId: vote.voterId,
          },
        },
      },
      {
        $set: {
          "votes.$.voteType": vote.voteType,
        },
      },
      {
        new: false,
      }
    );
    return result;
  } catch (error) {
    throw error;
  }
};
//#endregion

//#region report controller
const getReports = async postId => {
  try {
    const result = await Post.findById(postId);
    return result.reports;
  } catch (error) {
    throw error;
  }
};

const isReported = async (postId, userReportId) => {
  try {
    const result = await Post.findById(postId, {
      reports: {
        $elemMatch: {
          userReportId,
        },
      },
    });
    return result.reports[0];
  } catch (error) {
    throw error;
  }
};

const addReport = async (postId, report) => {
  try {
    const reported = await isReported(postId, report.userReportId);
    if (reported) return "Bạn đã tố cáo bài viết này";
    const result = await Post.findByIdAndUpdate(postId, {
      $push: {
        reports: report,
      },
    });
    return "Tố cáo bài viết thành công";
  } catch (error) {
    throw error;
  }
};
//#endregion

const testNotification = async p => {
  try {
    const result = await ExpoService.sendNotifications("1", [
      "ExponentPushToken[OUu4s1LnwxqRi170yT_G4-]",
    ]);
    return result;
  } catch (error) {
    throw error;
  }
};

const t = async p => {
  try {
    //todo
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  add,
  get,
  editPost,
  deleteById,
  postTextSearch,
  getByOwnerId,
  getPublicByTypeId,
  findPostById,
  /////////////////
  getImages,
  addImages,
  removeImage,
  ////////////////
  getComments,
  addComment,
  editComment,
  deleteComment,
  ///////////////
  vote,
  getVoteByType,
  /////////////
  addReport,
  getReports,
  //
  testNotification,
  findPostById,
};
