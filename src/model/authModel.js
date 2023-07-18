const mongoose = require('mongoose');

const { Schema } = mongoose;

const authSchema = new Schema({
	username: {
		type: String,
		required: true,
		maxlength: 50,
		unique: true,
		dropDups: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		dropDups: true,
	},
	password: {
		type: String,
		required: true,
	},
	verified: Boolean,
});

const AuthModel = mongoose.model('user', authSchema);

module.exports = {
	AuthModel,
};
