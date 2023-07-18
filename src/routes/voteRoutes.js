const express = require('express');
const { addLike, addComment } = require('../controller/voteController');
const logger = require('../logger/index');
const { verifyToken } = require('../util/jwt');

const voteRouter = express.Router();

voteRouter.put('/upvote/:id', verifyToken, addLike);

voteRouter.put('/new/:id', verifyToken, addComment);

module.exports = {
	voteRouter,
};
