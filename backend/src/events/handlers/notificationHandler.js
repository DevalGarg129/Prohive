exports.handleNotification = async (data) => {
  const message = JSON.parse(data);
  console.log('Send notification to room:', message.roomId);
};
