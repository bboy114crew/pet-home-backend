const mongoose = require("mongoose");

const imageSchema = mongoose.Schema({
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

const petSchema = mongoose.Schema({
  ownerId: {
    type: String,
    ref: "User",
  },
  name: {
    type: String,
  },
  age: {
    type: Number,
  },
  breed: {
    type: String,
  },
  branch: {
    type: String,
  },
  gender: {
    type: String,
  },
  description: {
    type: String,
  },
  images: [imageSchema],
  likes: [
    {
      user: {
        type: String,
        ref: "User",
      },
      _id: false
    },
  ],
  ignores: [
    {
      user: {
        type: String,
        ref: "User",
      },
      _id: false
    },
  ],
  deletionFlag: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Number,
    default: new Date().getTime(),
  },
  updatedAt: {
    type: Number,
    default: new Date().getTime(),
  },
});

let Pet = (module.exports = mongoose.model("Pet", petSchema));

petSchema.pre("save", async function(next) {
  const currTime = new Date().getTime();
  this.updatedAt = currTime;
  if (this.isNew) {
    this.createdAt = currTime;
  }
  next();
});
