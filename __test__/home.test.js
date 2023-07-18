/* eslint-disable no-undef */

// eslint-disable-next-line import/no-extraneous-dependencies
const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../src/app');
const { redisConnect, redisDisconnect } = require('../src/util/redis');

const image = `${__dirname}/../mern-stack.png`;
require('dotenv').config();

beforeAll(async () => {
	mongoose.set('strictQuery', true);
	await mongoose.connect(process.env.MONGODB);
	await redisConnect();
});

afterAll(async () => {
	await mongoose.disconnect();
	await redisDisconnect();
});

describe('All Test For Fetching Data.', () => {
	test('Should Get 404 on Unexpected Route', (done) => {
		request(app)
			.get('/aadd')
			.then((response) => {
				expect(response.statusCode).toBe(404);
				done();
			});
	});

	test('Should Get data Of home', (done) => {
		request(app)
			.get('/')
			.then((response) => {
				expect(response.statusCode).toBe(200);
				done();
			});
	});
});
