const errorHanlding = (err, req, res, next) => {
	res.status(err.status || 500).json({
		status: err.status,
		message: err.message || 'An error occurred',
	});
};

module.exports = {
	errorHanlding,
};
