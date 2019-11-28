const { Expo } = require("expo-server-sdk");
let expo = new Expo();
const sendNotifications = ({ tokens, data }) => {
  const messages = tokens.map(token => {
    return {
      to: token,
      sound: "default",
      body: data.message,
      data,
    };
  });
  return Promise.all(
    expo
      .chunkPushNotifications(messages)
      .map(expo.sendPushNotificationsAsync, expo)
  );
};

module.exports = {
  sendNotifications,
};
