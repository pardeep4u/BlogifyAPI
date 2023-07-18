const express = require('express');
const logger = require('../logger/index');

const { verifyToken } = require('../util/jwt');
const { deletePost } = require('../controller/dataController');

const deleteContentRouter = express.Router();

deleteContentRouter.delete('/post', verifyToken, deletePost);

module.exports = {
	deleteContentRouter,
};
