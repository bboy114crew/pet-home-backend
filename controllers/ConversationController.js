const ConversationServices = require("../services/ConversationServices");

const createConversation = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    const result = await ConversationServices.createConversation(req.body);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const getConversationsByUser = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    const userId = req.params.userId;
    const result = await ConversationServices.getConversationsByUser(userId);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const findConversationByUsers = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    const result = await ConversationServices.findConversationByUsers(req.body);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const getMessagesInConversation = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    const conversationId = req.params.conversationId;
    const result = await ConversationServices.getMessagesInConversation(
      conversationId
    );
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const addMessage = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    const result = await ConversationServices.addMessage(req.body);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const t = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

module.exports = {
  createConversation,
  getConversationsByUser,
  findConversationByUsers,
  addMessage,
  getMessagesInConversation,
};
