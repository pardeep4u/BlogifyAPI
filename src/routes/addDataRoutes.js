const express = require('express');
const logger = require('../logger/index');

const { postPost } = require('../controller/dataController');
const { verifyToken } = require('../util/jwt');
const {
	checkerForAddingData,
} = require('../validation/validatorForAddingData');

const addContentRouter = express.Router();

addContentRouter.post('/post', verifyToken, checkerForAddingData, postPost);

module.exports = {
	addContentRouter,
};
