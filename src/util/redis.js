const { createClient } = require('redis');
const logger = require('../logger');
require('dotenv').config();

const client = createClient({
	socket: {
		port: process.env.REDIS_PORT,
		host: process.env.REDIS_HOST,
	},
});
client.on('error', (err) => {
	logger.info('Redis Client Error', err);
});

async function redisDisconnect() {
	await client.disconnect();
}

async function redisConnect() {
	await client.connect();
}

async function redisCache(req, res, next) {
	const value = await client.get('home');
	if (value === null) {
		next();
	} else {
		const newData = JSON.parse(value);
		res.status(200).json([...newData]);
	}
}

async function redisCacheForTags(req, res, next) {
	const value = await client.get('tags');
	if (value === null) {
		next();
	} else {
		const newData = JSON.parse(value);
		res.status(200).json([...newData]);
	}
}

module.exports = {
	redisCache,
	redisConnect,
	redisDisconnect,
	redisCacheForTags,
	client,
};
