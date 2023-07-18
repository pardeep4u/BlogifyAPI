const createHttpError = require('http-errors');

const verifyToken = (req, res, next) => {
	const bearerHeader = req.headers.authorization;
	if (typeof bearerHeader !== 'undefined') {
		req.token = bearerHeader.split(' ')[1];
		next();
	} else {
		next(createHttpError(401, 'Unauthorized Access.'));
	}
};

module.exports = {
	verifyToken,
};
