const Notification = require('../models/Notification');
const socketService = require('./socketService');

exports.createNotification = async ({ recipient, sender, type, post }, app) => {
	try {
		const notif = await Notification.create({ recipient, sender, type, post });

		// populate minimal sender info for client
		const populated = await Notification.findById(notif._id).populate('sender', 'username fullName avatar');

		// Emit real-time notification to recipient
		socketService.emitToUser(recipient, 'notification:new', {
			type,
			from: populated.sender,
			post,
			id: populated._id,
		}, app);

		return populated;
	} catch (e) {
		console.error('createNotification error:', e);
		throw e;
	}
};

exports.markRead = async (id, userId) => {
	try {
		const n = await Notification.findOneAndUpdate({ _id: id, recipient: userId }, { isRead: true }, { new: true });
		return n;
	} catch (e) {
		console.error('markRead error:', e);
		throw e;
	}
};

exports.markAllRead = async (userId) => {
	try {
		await Notification.updateMany({ recipient: userId, isRead: false }, { $set: { isRead: true } });
		return true;
	} catch (e) {
		console.error('markAllRead error:', e);
		throw e;
	}
};

