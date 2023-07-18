// eslint-disable-next-line import/no-extraneous-dependencies
const createError = require('http-errors');
const logger = require('../logger');
const { ContentModel } = require('../model/contentModel');
// eslint-disable-next-line import/no-extraneous-dependencies, import/order
const jwt = require('jsonwebtoken');

const addLike = (req, res, next) => {
	jwt.verify(
		req.token,
		process.env.JWT_SECRET,
		async (errorToken, authdata) => {
			if (errorToken) {
				next(createError(401, 'Your Session Has Expired'));
				return;
			}

			// First find the post

			const ifPost = await ContentModel.findOne({ _id: req.params.id });
			if (!ifPost) {
				next(createError(404, 'No blog post Found!'));
				return;
			}

			// then check of already liked using authdata
			if (ifPost.like.includes(authdata.email)) {
				next(createError(409, 'Already Liked By the User!'));
				return;
			}

			// If alredy liked put it send no ok respone
			// If not liked then add email in array.

			ifPost.like.push(authdata.email);

			ContentModel.findByIdAndUpdate(
				req.params.id,
				{ $set: ifPost },
				{ new: true },
				(err, docs) => {
					if (err) {
						logger.warn(err);
						next(createError(400, 'Enter a Valid Content ID'));
					} else {
						logger.info('Updated User : ', docs);
						res.status(201).json({
							message: 'Liked',
							docs,
						});
					}
				}
			);
		}
	);
};

const addComment = (req, res, next) => {
	// First check if there is message
	if (!req.body.message) {
		next(400, 'A Comment must be Provided');
		return;
	}

	// Verify Token
	jwt.verify(
		req.token,
		process.env.JWT_SECRET,
		async (errorToken, authdata) => {
			if (errorToken) {
				next(createError(401, 'Your Session Has Expired'));
				return;
			}

			// First find the post
			const ifPost = await ContentModel.findOne({ _id: req.params.id });
			if (!ifPost) {
				next(createError(404, 'No blog post Found!'));
				return;
			}

			// There is no nedd to check if user is already commented because one can do multiple comments
			// Adding new comment into the list
			ifPost.comments.push({
				email: authdata.email,
				message: req.body.message,
			});

			// Updating the list
			ContentModel.findByIdAndUpdate(
				req.params.id,
				{ $set: ifPost },
				{ new: true },
				(err, docs) => {
					if (err) {
						logger.warn(err);
						next(createError(400, 'Enter a Valid Content ID'));
					} else {
						logger.info('Updated User : ', docs);
						res.status(201).json({
							message: 'Liked',
							docs,
						});
					}
				}
			);
		}
	);

	//
};

module.exports = {
	addLike,
	addComment,
};
