const express = require('express');
const logger = require('../logger/index');

const {
	getHome,
	getAllTags,
	getFitembytags,
	getAllPostByUser,
	searchField,
	getSinglePost,
} = require('../controller/homeController');
const { redisCache, redisCacheForTags } = require('../util/redis');

const homeRouter = express.Router();

homeRouter.get('/', redisCache, getHome);

homeRouter.get('/get-single-post/:id', getSinglePost);
homeRouter.get('/get-all-tags', redisCacheForTags, getAllTags);
homeRouter.get('/get-post-by-tag', getFitembytags);

homeRouter.get('/get-all-post-by-user', getAllPostByUser);
homeRouter.get('/find-an-ele', searchField);

module.exports = {
	homeRouter,
};
