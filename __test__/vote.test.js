/* eslint-disable no-undef */

// eslint-disable-next-line import/no-extraneous-dependencies
const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../src/app');
const { redisConnect, redisDisconnect } = require('../src/util/redis');
const logger = require('../src/logger');

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

describe('Test For Liking a POST or Comment on IT.', () => {
	test('SHOULD LIKE IF USER IS AUTHENTICATED', (done) => {
		request(app)
			.put('/vote/upvote/64ad4badeab5f0a9a99514db')
			.set('Authorization', `bearer ${process.env.JWT_TOKEN_FOR_TESTING}`)
			.then((response) => {
				expect(response.statusCode).toBe(201);
				done();
			});
	});

	/*

	Dislike Feature is Removed!

	test('SHOULD DISLIKE IF USER IS AUTHENTICATED', (done) => {
		request(app)
			.put('/vote/downvote/64ad4badeab5f0a9a99514db')
			.set('Authorization', `bearer ${process.env.JWT_TOKEN_FOR_TESTING}`)
			.then((response) => {
				expect(response.statusCode).toBe(201);
				done();
			});
	});
	*/
	test('SHOULD THROW EN ERROR FOR NOT AUTHENTICATED', (done) => {
		request(app)
			.put('/vote/upvote/64ad4badeab5f0a9a99514db')
			.set('Authorization', 'bearer ')
			.then((response) => {
				expect(response.statusCode).toBe(401);
				done();
			});
	});

	test('SHOULD COMMENT IF USER IS AUTHENTICATED', (done) => {
		request(app)
			.put('/comment/new/64ad4badeab5f0a9a99514db')
			.send({ message: 'This comment is from testing File' })
			.set('Content-Type', 'application/json')
			.set('Authorization', `bearer ${process.env.JWT_TOKEN_FOR_TESTING}`)
			.then((response) => {
				expect(response.statusCode).toBe(201);
				done();
			});
	});
});
