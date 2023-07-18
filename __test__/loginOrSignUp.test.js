/* eslint-disable no-undef */

// eslint-disable-next-line import/no-extraneous-dependencies
const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../src/app');
// const  = require('jest');
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

describe('Test For Login OR SIGN UP A USER A user', () => {
	test('Should login a user with valid credentials', (done) => {
		request(app)
			.post('/auth/login')
			.send({ email: 's@gmail.com', password: 'vashisht@123' })
			.set('Content-Type', 'application/json')
			.then((response) => {
				expect(response.statusCode).toBe(200);
				done();
			});
	});
	test('Should Throw An error about not providing proper crediantals', (done) => {
		request(app)
			.post('/auth/login')
			.send({ password: 'vashisht@123' })
			.set('Content-Type', 'application/json')
			.then((response) => {
				expect(response.statusCode).toBe(400);
				done();
			});
	});
	test('Should Throw An error about not providing proper password', (done) => {
		request(app)
			.post('/auth/login')
			.send({ email: 's@gmail.com' })
			.set('Content-Type', 'application/json')
			.then((response) => {
				expect(response.statusCode).toBe(400);
				done();
			});
	});
	/*

	Something is missing in this test case!

	test('Should Sign UP  a User', (done) => {
		jest.setTimeout(20000);
		request(app)
			.post('/auth/signup/')
			.set('Content-Type', 'application/json')
			.send({
				username: 'Pardeep kumars',
				email: '19bcss1896@gmail.com',
				password: 'vashisht',
			})
			.then((response) => {
				expect(response.statusCode).toBe(200);
				done();
			})
			.catch((reson) => {
				console.log(reson);
			});
	}, 10000);
	*/
	test('Should Throw En Error For Not sending  EMAIL', (done) => {
		request(app)
			.post('/auth/signup/')
			.send({
				// email: 's@gmail.com',
				password: 'vashisht@123',
				username: 'pardeep kumar g',
			})
			.set('Content-Type', 'application/json')
			.then((response) => {
				expect(response.statusCode).toBe(400);
				done();
			});
	});
	test('Should Throw En Error For Not sending  Password', (done) => {
		request(app)
			.post('/auth/signup/')
			.send({
				email: 's@gmail.com',
				//	password: 'vashisht@123',
				username: 'pardeep kumar g',
			})
			.set('Content-Type', 'application/json')
			.then((response) => {
				expect(response.statusCode).toBe(400);
				done();
			});
	});
	test('Should Throw En Error For Not sending  Username', (done) => {
		request(app)
			.post('/auth/signup/')
			.send({
				email: 's@gmail.com',
				password: 'vashisht@123',
				// username: 'pardeep kumar g',
			})
			.set('Content-Type', 'application/json')
			.then((response) => {
				expect(response.statusCode).toBe(400);
				done();
			});
	});
});
