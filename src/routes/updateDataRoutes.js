const express = require('express');
const logger = require('../logger/index');

const { verifyToken } = require('../util/jwt');

const { putUpdate } = require('../controller/dataController');
const {
	checkerForUpdatingData,
} = require('../validation/validatorForAddingData');

const updateContentRouter = express.Router();

updateContentRouter.put(
	'/post',
	verifyToken,
	checkerForUpdatingData,
	putUpdate
);

module.exports = {
	updateContentRouter,
};
