// Simple Socket.IO helper service
// Provides a thin wrapper around the global `io` instance used across the app.

function getIO(app) {
	if (app && typeof app.get === 'function') {
		const io = app.get('io');
		if (io) return io;
	}
	if (global && global.io) return global.io;
	return null;
}

exports.emitToUser = (userId, event, payload, app) => {
	const io = getIO(app);
	if (!io) return false;
	io.to(`user:${userId}`).emit(event, payload);
	return true;
};

exports.emitToRoom = (roomId, event, payload, app) => {
	const io = getIO(app);
	if (!io) return false;
	io.to(roomId).emit(event, payload);
	return true;
};

exports.broadcast = (event, payload, app) => {
	const io = getIO(app);
	if (!io) return false;
	io.emit(event, payload);
	return true;
};

exports.getIO = getIO;
