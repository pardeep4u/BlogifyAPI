require('dotenv').config();

// eslint-disable-next-line import/no-extraneous-dependencies, import/order
const AWS = require('aws-sdk');

// eslint-disable-next-line prefer-const
let s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY,
	secretAccessKey: process.env.AWS_SECRET_KEY,
	region: process.env.AWS_REGION,
});

module.exports = {
	s3,
};
