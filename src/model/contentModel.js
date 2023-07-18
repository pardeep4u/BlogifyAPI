const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const userSchema = new Schema({
	content: {
		title: {
			type: String,
			required: true,
			maxlength: 70,
		},
		imageUrl: {
			type: String,
			required: true,
		},
		story: {
			type: String,
			required: true,
		},
		tags: {
			type: Array,
		},
		postedBy: {
			type: String,
			required: true,
		},
	},
	like: { type: Array },
	comments: { type: Array },
});

// Creating an Index for better Performance
userSchema.index({ 'content.title': 'text' });

const ContentModel = mongoose.model('content', userSchema);

module.exports = {
	ContentModel,
};
