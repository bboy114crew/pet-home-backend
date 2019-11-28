const mongoose = require("mongoose");
const Types = mongoose.Schema.Types;

const messageSchema = mongoose.Schema({
  sender: {
    type: Types.ObjectId,
    ref: "User",
  },
  content: Types.String,
  createdAt: {
    type: Types.Number,
    default: new Date().getTime(),
  },
});

const users = {
  _id: false,
  user: {
    type: Types.ObjectId,
    ref: "User",
  },
};

const conversationSchema = mongoose.Schema({
  users: [users],
  messages: [messageSchema],
  createdAt: {
    type: Types.Number,
    default: new Date().getTime(),
  },
});

module.exports = mongoose.model("Conversation", conversationSchema);
