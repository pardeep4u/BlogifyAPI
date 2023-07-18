const express = require('express');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');
// eslint-disable-next-line import/no-extraneous-dependencies
const fileUpload = require('express-fileupload');
// eslint-disable-next-line import/no-extraneous-dependencies
const createHttpError = require('http-errors');
const { homeRouter } = require('./routes/homeRoutes');
const { adminRouter } = require('./routes/adminRoutes');
const { authRouter } = require('./routes/authRoutes');
const { updateContentRouter } = require('./routes/updateDataRoutes');
const { deleteContentRouter } = require('./routes/deleteDataRoutes');
const { addContentRouter } = require('./routes/addDataRoutes');
const { notFound } = require('./errorHandler/notFound');
const { errorHanlding } = require('./errorHandler/errorHandler');
const logger = require('./logger');
const { voteRouter } = require('./routes/voteRoutes');
const { redisConnect } = require('./util/redis');
const { emailHandler } = require('./controller/authController');

require('dotenv').config();

const app = express();

// eslint-disable-next-line spaced-comment
//app.use(express.json({ limit: '50mb' }));
// eslint-disable-next-line spaced-comment
//app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
	fileUpload({
		limits: { fileSize: 1024 * 1024 }, // 1MB limit
	})
);

app.use('/auth', authRouter);
app.use('/', homeRouter);
app.use('/add', addContentRouter);
app.use('/update', updateContentRouter);
app.use('/delete', deleteContentRouter);
app.use('/vote', voteRouter);
app.use('/admin', adminRouter);
app.use('/comment', voteRouter);

// verify mail
app.get('/verifyemail/:id', emailHandler);

app.use(notFound);
app.use(errorHanlding);

module.exports = {
	app,
};
