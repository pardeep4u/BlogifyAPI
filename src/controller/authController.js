const createError = require('http-errors');
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcrypt');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
// eslint-disable-next-line import/no-extraneous-dependencies
const Mailgen = require('mailgen');
const nodemailer = require('nodemailer');

// eslint-disable-next-line import/no-extraneous-dependencies
const { validationResult } = require('express-validator');
const { default: mongoose } = require('mongoose');
const { AuthModel } = require('../model/authModel');
const logger = require('../logger/index');

const postSignUp = async (req, res, next) => {
	// Verify if there any error.
	const errorInValidation = validationResult(req);
	if (!errorInValidation.isEmpty()) {
		logger.info(errorInValidation.errors);
		next(
			createError(
				400,
				errorInValidation.errors[0].msg || errorInValidation.errors.msg
			)
		);
		return;
	}

	// Check if email is already exist.

	const ifAlreadyEmailExist = await AuthModel.findOne({
		email: req.body.email,
	});
	if (ifAlreadyEmailExist) {
		res.status(409).json({
			message: 'email Already exist',
		});
		return;
	}

	// Check if user name aready exist
	const ifAlreadyusername = await AuthModel.findOne({
		username: req.body.username,
	});
	if (ifAlreadyusername) {
		res.status(409).json({
			message: 'Username Already exist',
		});
		return;
	}

	// setting up transporter
	const config = {
		service: 'gmail',
		auth: {
			user: process.env.TRANSPORTER_EMAIL,
			pass: process.env.TRANSPORTER_EMAIL_PASS,
		},
	};
	const transporter = nodemailer.createTransport(config);
	const newPass = await bcrypt.hash(req.body.password, 7);
	const data = {
		email: req.body.email,
		username: req.body.username,
		password: newPass,
	};

	// Generating token
	jwt.sign(
		data,
		process.env.JWT_SECRET,
		{ expiresIn: '10m' },
		async (tokenError, token) => {
			// If error occured during creating token
			if (tokenError) {
				res.json({
					tokenError,
				});
				return;
			}

			try {
				// Put in try catch block
				await AuthModel.insertMany([{ ...data, verified: false }]);

				// Sending email to verify token
				transporter
					.sendMail({
						from: 'process.env.TRANSPORTER_EMAIL',
						to: data.email,
						// eslint-disable-next-line quotes
						html: `<div><h1>Click below link to Confirm you email address.</h1> <a href='http://localhost:3050/verifyemail/${token}'>Click Here</a> </div>`,
					})
					.then((datam) => {
						logger.info(datam);
						res.status(200).json({
							message:
								'Check your email to verify your email address.',
						});
					})
					.catch((errrr) => {
						logger.info(errrr);
						createError(createError(500, errrr));
					});
			} catch (errorInTryCatch) {
				createError(createError(500, errorInTryCatch));
			}
		}
	);

	//	const transporter = nodemailer.createTransport(config);
	/*
	transporter
		.sendMail({
			from: 'process.env.TRANSPORTER_EMAIL',
			to: '19bcs1896@gmail.com',
			html: '<div><h1>Click below link to Confirm you email address.</h1> <a href="http://locahost:3050/auth/verifyemail/">Click Here</a> </div>',
		})
		.then((datam) => {
			logger.info(datam);
			res.send('datam');
		})
		.catch((errrr) => {
			logger.info(errrr);
		});
	/*
	const errorInValidation = validationResult(req);
	if (!errorInValidation.isEmpty()) {
		logger.info(errorInValidation.errors);
		next(
			createError(
				400,
				errorInValidation.errors[0].msg || errorInValidation.errors.msg
			)
		);
	} else {
		bcrypt
			.hash(req.body.password, 7)
			.then((hashedPass) => {
				const data = new AuthModel({
					username: req.body.username,
					email: req.body.email,
					password: hashedPass,
				});

				data.save()
					.then((val) => {
						res.status(201).json({
							message: 'New User Created',
							val,
						});
					})
					.catch((err) => {
						logger.info(err);
						next(
							createError(
								500,
								'Internal Server Error & Something Went Worng'
							)
						);
					});
			})
			.catch((error) => {
				logger.info(error);
				next(
					createError(
						500,
						'Internal Server Error & Something Went Worng'
					)
				);
			});
	}
	*/
};

const emailHandler = async (req, res, next) => {
	jwt.verify(
		req.params.id,
		process.env.JWT_SECRET,
		async (errorToken, authdata) => {
			if (errorToken) {
				res.send('logos');
			} else {
				await AuthModel.updateOne(
					{ email: authdata.email },
					{ verified: true }
				);
				res.status(200).json({
					verified: true,
					message: 'Your email is verified now',
				});
			}
		}
	);
};

const postLogin = (req, res, next) => {
	// Handling any Validation Error
	const errorInValidation = validationResult(req);
	if (!errorInValidation.isEmpty()) {
		logger.info(errorInValidation.errors);
		next(
			createError(
				400,
				errorInValidation.errors[0].msg || errorInValidation.errors.msg
			)
		);

		return;
	}

	// Finding the USer
	AuthModel.findOne({ email: req.body.email }, (err, docs) => {
		// Fi there error occur while finding the user.
		if (err) {
			logger.warn(err);
			next(
				createError(500, 'Internal Server Error & Something Went Worng')
			);
			return;
		}

		// IF no user found!
		if (docs === null) {
			next(createError(400, 'No user Find With this email'));
			return;
		}

		// Check if use Email is verified or not.
		if (!docs.verified) {
			next(createError(402, 'Unverfied User'));
			return;
		}

		bcrypt.compare(req.body.password, docs.password).then((value) => {
			if (value) {
				const obj = {
					email: docs.email,
					username: docs.username,
					id: docs.id,
				};
				jwt.sign(
					obj,
					process.env.JWT_SECRET,
					{ expiresIn: '15m' },
					(tokenError, token) => {
						if (tokenError) {
							res.json({
								docs,
								value,
								tokenError,
							});
							return;
						}
						res.status(200).json({
							docs,
							isUser: value,
							token,
						});
					}
				);
			} else {
				next(createError(400, 'Incorrect Password!'));
			}
		});
	});
};

module.exports = {
	postSignUp,
	postLogin,
	emailHandler,
};
