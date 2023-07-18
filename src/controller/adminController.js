// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const logger = require('../logger');
require('dotenv').config();

const getLogin = (req, res, next) => {
	jwt.verify(req.token, process.env.JWT_SECRET, (err, authdata) => {
		if (err) {
			res.json({
				err,
			});
		} else {
			res.json({
				message: 'Welcome to Login Page',
				authdata,
			});
		}
	});
};

const postLogin = (req, res, next) => {
	// First Check The User is Login OR not Then send JWT token
	// Some chane

	const variable = req.body.node;

	jwt.sign(
		variable,
		process.env.JWT_SECRET,
		{ expiresIn: '5m' },
		(err, token) => {
			res.json({
				message: 'Welcome to Post Login Page',
				variable,
				token,
			});
		}
	);
};

module.exports = {
	getLogin,
	postLogin,
};
