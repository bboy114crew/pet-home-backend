const mongoose = require("mongoose");

let NotificationSchema = mongoose.Schema({
  sender: { type: String, ref: "User" },
  receiver: { type: String, ref: "User" },
  content: { type: Object },
  type: { type: String },
  message: { type: String },
  hidden: { type: Array },
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

let Notification = (module.exports = mongoose.model(
  "Notification",
  NotificationSchema
));

NotificationSchema.pre("save", async function(next) {
  const currTime = new Date().getTime();
  this.updatedAt = currTime;
  if (this.isNew) {
    this.createdAt = currTime;
  }
  next();
});
