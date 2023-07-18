// eslint-disable-next-line import/no-extraneous-dependencies
const createError = require('http-errors');
const logger = require('../logger');
const { ContentModel } = require('../model/contentModel');
const { client } = require('../util/redis');

const getSinglePost = async (req, res, next) => {
	try {
		const data = await ContentModel.findOne({ _id: req.params.id });

		if (!data) {
			next(createError(400, 'No blog post Found!'));
			return;
		}

		res.status(200).json(data);
	} catch (err) {
		next(createError(400, err.message));
	}
};

const getHome = (req, res, next) => {
	ContentModel.find(
		{},
		[],
		{ sort: { like: 'descending' } },
		async (err, docs) => {
			if (err) {
				logger.warn(err);
				next(createError(500, 'Internal server Error!'));
				return;
			}
			const newData = JSON.stringify(docs);
			await client.set('home', newData, { PX: 30000 });
			// await client.setEx('home', 5);
			res.status(200).json(docs);
		}
	);
};

const getAllTags = (req, res, next) => {
	ContentModel.aggregate([
		{ $unwind: '$content.tags' },
		{
			$group: {
				_id: null,
				uniqueElements: { $addToSet: '$content.tags' },
			},
		},
		{ $project: { _id: 0, uniqueElements: 1 } },
	]).exec(async (err, result) => {
		if (err) {
			next(createError(500, err));
			return;
		}
		logger.info(result);
		const newData = JSON.stringify(result);
		await client.set('tags', newData, { PX: 30000 });
		res.send(result);
	});
};

const getFitembytags = (req, res, next) => {
	ContentModel.aggregate([
		{
			$match: {
				'content.tags': {
					$regex: req.body.tag,
					$options: 'i', // 'i' option for case-insensitive search
				},
			},
		},
	]).exec((err, results) => {
		if (err) {
			// Handle error
			console.error(err);
			return;
		}

		res.send(results);
	});
};

const getAllPostByUser = (req, res, next) => {
	ContentModel.find(
		{ 'content.postedBy': req.body.email },
		async (err, docs) => {
			if (err) {
				logger.warn(err);
				next(createError(500, 'Internal server Error!'));
				return;
			}
			const newData = JSON.stringify(docs);
			await client.set('home', newData, { PX: 30000 });
			// await client.setEx('home', 5);
			res.status(200).json(docs);
		}
	);
};

const searchField = async (req, res, next) => {
	// Finding Results
	const results = await ContentModel.find({
		'content.title': { $regex: new RegExp(req.query.search, 'i') },
	});

	res.status(200).json(results);
};

module.exports = {
	getHome,
	getAllTags,
	getFitembytags,
	getAllPostByUser,
	searchField,
	getSinglePost,
};
