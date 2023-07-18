const { app } = require('./app');
const logger = require('./logger');
const { redisConnect } = require('./util/redis');
// eslint-disable-next-line import/order
const mongoose = require('mongoose');
require('dotenv').config({
	path: '../.env',
});

// console.log(process.env.MONGODB);

mongoose.set('strictQuery', true);
redisConnect()
	.then(() => {
		logger.info('redis check!');
		mongoose
			.connect(process.env.MONGODB)
			.then((val) => {
				logger.info(`Connted To Db ${val}`);
				app.listen(process.env.PORT, () => {
					logger.info(`currently ON ${process.env.PORT}`);
				});
			})
			.catch((err) => {
				logger.info(`Failed To Connected To DB ${err}`);
			});
	})
	.catch(() => {
		logger.info('redis Error');
	});
