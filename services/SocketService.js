const socket = require("socket.io");
const ConversationService = require("./ConversationServices");

class SocketService {
  constructor() {
    this.io = null;
  }

  configure(server) {
    this.io = socket(server);
    this.io.on("connection", socket => {
      onConnection(socket);
    });
  }
}

const onConnection = socket => {
  socket.on("joinConversation", conversation =>
    joinConversation(socket, conversation)
  );
  socket.on("sendMessage", mes => {
    sendMessage(mes);
  });
  socket.on("disconnect", reason => {
    socket.leaveAll();
  });
};

const joinConversation = (socket, conversation) => {
  console.log("socket joined: ", conversation._id);
  socket.join(conversation._id);
};

const sendMessage = async mes => {
  try {
    const io = socketService.io;
    const messageData = {
      conversationId: mes.conversationId,
      message: {
        sender: mes.user._id,
        content: mes.message.text,
      },
    };
    await ConversationService.addMessage(messageData);
    io.in(mes.conversationId).emit("sendMessage", mes);
  } catch (error) {
    throw error;
  }
};

const socketService = new SocketService();

module.exports = socketService;
