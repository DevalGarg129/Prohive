const { publisher } = require('../config/redis');

exports.sendMessage = async (req, res) => {
  const messageData = {
    userId: req.user.id,
    roomId: req.body.roomId,
    message: req.body.message,
    timestamp: Date.now(),
  };

  await publisher.publish('chat:message', JSON.stringify(messageData));

  res.json({ success: true });
};
