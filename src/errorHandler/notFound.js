// eslint-disable-next-line import/no-extraneous-dependencies
const createError = require('http-errors');

const notFound = (req, res, next) => {
	next(createError(404, 'Page Not Found'));
};

module.exports = {
	notFound,
};
