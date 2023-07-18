const express = require('express');

const { getLogin, postLogin } = require('../controller/adminController');
const { verifyToken } = require('../util/jwt');

const adminRouter = express.Router();

// /admin/login

adminRouter.get('/login', verifyToken, getLogin);

adminRouter.post('/login', postLogin);

module.exports = {
	adminRouter,
};
