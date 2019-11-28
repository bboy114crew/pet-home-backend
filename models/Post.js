const mongoose = require("mongoose");

let commentSchema = mongoose.Schema({
  userCommentId: { type: String, ref: "User" },
  content: { type: String },
  createdAt: {
    type: Number,
    default: new Date().getTime(),
  },
});

let imageSchema = mongoose.Schema({
  url: { type: String },
  width: {
    type: Number,
    default: 0,
  },
  height: {
    type: Number,
    default: 0,
  },
  publicId: { type: String },
});

let voteSchema = {
  voterId: {
    type: String,
    ref: "User",
  },
  voteType: {
    type: Number, // 0 is down, 1 is up
  },
};

let postSchema = mongoose.Schema({
  title: { type: String },
  ownerId: { type: String, ref: "User" },
  typeId: { type: String, ref: "PostCategory" },
  status: {
    type: Number,
    default: 1, // 0 is private, 1 is public
  },
  votes: [voteSchema],
  comments: [commentSchema],
  images: [imageSchema],
  createdAt: {
    type: Number,
    default: new Date().getTime(),
  },
  updatedAt: {
    type: Number,
    default: new Date().getTime(),
  },
  deletionFlag: { type: Boolean, default: false },
});

postSchema.index({ title: "text", "ownerId.appName": "text" });

let Post = (module.exports = mongoose.model("Post", postSchema));

postSchema.pre("save", async function(next) {
  const currTime = new Date().getTime();
  this.updatedAt = currTime;
  if (this.isNew) {
    this.createdAt = currTime;
  }
  next();
});

commentSchema.pre("save", async function(next) {
  const currTime = new Date().getTime();
  if (this.isNew) {
    this.createdAt = currTime;
  }
  next();
});
