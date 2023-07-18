// eslint-disable-next-line import/no-extraneous-dependencies
const { check } = require('express-validator');

const checkerForLogin = [
	check('email', 'Enter Proper Email Address').isEmail(),
	check('password', 'Must Enter a password').not().isEmpty(),
	check('password', 'Password Greater than 5 Characters').isLength({
		min: 6,
	}),
];

const checkerForSignUp = [
	check('username', 'Enter Proper Username Length > 5 & < 15').isLength({
		min: 5,
		max: 15,
	}),
	check('email', 'Enter Proper Email').isEmail(),
	check('password', 'Enter a Password').not().isEmpty(),
	check('password', 'Enter a Password lenght > 6 ').isLength({
		min: 6,
	}),
];

module.exports = {
	checkerForLogin,
	checkerForSignUp,
};
