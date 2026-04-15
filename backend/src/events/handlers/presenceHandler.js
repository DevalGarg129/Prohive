const { publisher } = require('../../config/redis');

exports.handleUserOnline = async (data) => {
  const { userId } = JSON.parse(data);

  try {
    await publisher.set(`user:${userId}:online`, true, { EX: 60 });
  } catch (e) {
    console.error('presenceHandler error:', e);
  }
};
