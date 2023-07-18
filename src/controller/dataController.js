// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
// eslint-disable-next-line import/no-extraneous-dependencies
const createError = require('http-errors');
// eslint-disable-next-line import/no-extraneous-dependencies
const { body, validationResult } = require('express-validator');
const createHttpError = require('http-errors');
// eslint-disable-next-line import/no-extraneous-dependencies
const { ContentModel } = require('../model/contentModel');

const logger = require('../logger');
const { s3 } = require('../aws/aws');

const postPost = (req, res, next) => {
	jwt.verify(
		req.token,
		process.env.JWT_SECRET,
		async (errorToken, authdata) => {
			if (errorToken) {
				next(createHttpError(401, 'Your Session Has Expired'));
				return;
			}

			// const file = req.files.pic;
			// logger.info(file);
			const errorInValidation = validationResult(req);
			if (!errorInValidation.isEmpty()) {
				next(createHttpError(400, errorInValidation.errors[0].msg));
				return;
			}

			const file = req.files.pic;

			const params = {
				Bucket: process.env.AWS_BUCKET_NAME,
				Key: file.name,
				Body: file.data,
				ACL: 'public-read',
			};

			try {
				// Upload File to S3
				await s3.putObject(params, async (err, data) => {
					if (err) {
						logger.info(err);
						next(createError(500, 'Internal Server Error!'));
						return;
					}
					logger.info(data);

					// Get pre Signed Url
					const preSignedUrl = await s3.getSignedUrl('getObject', {
						Bucket: process.env.AWS_BUCKET_NAME,
						Key: file.name,
					});
					// iNSERT INTO db
					ContentModel.insertMany([
						{
							content: {
								title: req.body.postTitle,
								story: req.body.postStory,
								imageUrl: preSignedUrl,
								postedBy: authdata.email,
								tags: req.body.tags,
							},
						},
					])
						.then((value) => {
							res.send(value);
						})
						.catch((errors) => {
							res.send(errors);
						});
				});
			} catch (error) {
				logger.info(error);
				res.status(500).send('Internal Server Error!;');
			}

			// Upload file to S3
			// Upload data to dataBase with proper setting.
		}
	);

	// eslint-disable-next-line no-useless-return
};

const putUpdate = async (req, res, next) => {
	// First check validation error!
	const errorInValidation = validationResult(req);
	if (!errorInValidation.isEmpty()) {
		next(createHttpError(400, errorInValidation.errors[0].msg));
		return;
	}

	jwt.verify(
		req.token,
		process.env.JWT_SECRET,
		async (errorToken, authdata) => {
			// Fetch The Document from DB
			// Update if there is any file
			// Update the data in MongoDB
			if (errorToken) {
				next(createHttpError(401, 'Your Session Has Expired'));
				return;
			}

			try {
				const document = await ContentModel.findById(req.body.id);
				// IF there is no document
				if (!document) {
					next(createError(400, 'No Document found!'));
					return;
				}

				// If user is not hte author of the document
				if (!(authdata.email === document.content.postedBy)) {
					next(createError(400, 'Permession Denied!'));
					return;
				}
				// logger.info(req.files.pic.data);

				// If There is any File
				if (req.files) {
					// Fetching Image URl from DB
					const imageUrlParts = new URL(document.content.imageUrl);
					const imageKey = imageUrlParts.pathname.substring(1);

					// logger.info(`image key${imageKey}`);
					// logger.info(req.files.pic.name);

					// Deleting the already uploaded file
					const params = {
						Bucket: process.env.AWS_BUCKET_NAME,
						Key: imageKey,
					};
					s3.deleteObject(params, (erre, data1) => {
						if (erre) {
							logger.info(erre);
							next(createError(500, 'Internal Server Error!'));
							return;
						}

						// Now  Uploading The File With same key.
						const params2 = {
							Bucket: process.env.AWS_BUCKET_NAME,
							Key: imageKey,
							Body: req.files.pic.data, // New File but key will be same
							ACL: 'public-read',
						};
						s3.putObject(params2, (err, data) => {
							if (err) {
								logger.info(err);
								next(
									createError(
										500,
										'Error Occured while File uploading to S3'
									)
								);
								return;
								// Handle the error accordingly
							}
							logger.info(
								'File updated successfully on S3:',
								data
							);
							// Handle the success accordingly
						});
					});
				}

				// If there is document update it.

				const newDocumnet = {
					content: {
						...document.content,
						...req.body,
					},
				};
				const updatedDocument = await ContentModel.updateOne(
					{ _id: req.body.id },
					{ $set: newDocumnet },
					{ new: true }
				);

				res.json(updatedDocument);
			} catch (error) {
				next(createError(500, 'Something Went Wrong!'));
				logger.info('Error finding document by ID:', error);
			}
		}
	);
};

const deletePost = async (req, res, next) => {
	// First Verify Token
	jwt.verify(
		req.token,
		process.env.JWT_SECRET,
		async (errorToken, authdata) => {
			// Fetch The Document from DB
			// Update if there is any file
			// Update the data in MongoDB
			if (errorToken) {
				next(createHttpError(401, 'Your Session Has Expired'));
				return;
			}

			const data = await ContentModel.findById(req.body.id);

			if (!data) {
				next(createError(400, 'No blog Post Found!'));
				return;
			}

			// If the user is the author of the blog Post
			if (!(authdata.email === data.content.postedBy)) {
				next(createError(400, 'Access Denied!'));
				return;
			}

			// Fetch image url
			const imageUrlParts = new URL(data.content.imageUrl);
			const imageKey = imageUrlParts.pathname.substring(1);

			const params = {
				Bucket: process.env.AWS_BUCKET_NAME,
				Key: imageKey,
			};

			s3.deleteObject(params, (erre, data1) => {
				if (erre) {
					logger.info(erre);
				} else {
					logger.info('File deleted successfully from S3:', data1);
					ContentModel.deleteOne({ _id: req.body.id })
						.then((data2) => {
							res.send(data2);
						})
						.catch((err) => {
							res.send(err);
						});
				}
			});
		}
	);
};

module.exports = {
	postPost,
	putUpdate,
	deletePost,
};
