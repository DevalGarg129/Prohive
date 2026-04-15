const { subscriber } = require('../config/redis');
const { handleChatMessage } = require('./handlers/chatHandler');
const { handleNotification } = require('./handlers/notificationHandler');
const { handleUserOnline } = require('./handlers/presenceHandler');

exports.initSubscribers = async () => {
    // Subscribe to chat messages published by the chat controller
    await subscriber.subscribe('chat:message', async (data) => {
        try {
            await handleChatMessage(data);
        } catch (err) {
            console.error('Error handling chat message:', err);
        }
    });

    // Placeholder for future subscriptions (notifications, presence, etc.)
    // await subscriber.subscribe('notification', async (data) => { await handleNotification(data); });
    // await subscriber.subscribe('user:online', async (data) => { await handleUserOnline(data); });
};