const Message = require('../../models/messageModel');

exports.handleChatMessage = async (data) => {
  const message = JSON.parse(data);

  // Save to DB
  await Message.create(message);

  // Emit via socket if available on the global
  if (global && global.io && typeof global.io.to === 'function') {
    global.io.to(message.roomId).emit('newMessage', message);
  } else {
    console.warn('Socket.IO not available to emit newMessage');
  }
};
