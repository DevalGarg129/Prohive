const { createClient } = require('redis');
const { EventEmitter } = require('events');

// Underlying clients
let redisPubClient = createClient();
let redisSubClient = createClient();
let redisConnected = false;

// In-memory bus fallback
const bus = new EventEmitter();

// Proxy publisher/subscriber objects exported to consumers (keeps reference stable)
const publisher = {
	async publish(channel, message) {
		if (redisConnected && redisPubClient && typeof redisPubClient.publish === 'function') {
			return redisPubClient.publish(channel, message);
		}
		// fallback: emit on in-memory bus asynchronously
		process.nextTick(() => bus.emit(channel, message));
		return Promise.resolve();
	},
	async set(key, value, options) {
		if (redisConnected && redisPubClient && typeof redisPubClient.set === 'function') {
			return redisPubClient.set(key, value, options);
		}
		return Promise.resolve();
	},
};

const subscriber = {
	async subscribe(channel, handler) {
		if (redisConnected && redisSubClient && typeof redisSubClient.subscribe === 'function') {
			return redisSubClient.subscribe(channel, handler);
		}
		// fallback: listen on in-memory bus
		bus.on(channel, handler);
		return Promise.resolve();
	},
};

// Attempt to connect real Redis clients, fall back on error
(async () => {
	try {
		await redisPubClient.connect();
		await redisSubClient.connect();
		redisConnected = true;
		// optional: console.log('Redis clients connected');
	} catch (e) {
		console.error('Redis connect error:', e);
		redisConnected = false;
	}
})();

module.exports = { publisher, subscriber, bus };