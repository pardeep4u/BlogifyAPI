// eslint-disable-next-line import/no-extraneous-dependencies
const { check } = require('express-validator');

const checkerForAddingData = [
	check('postTitle', 'Must Have a Title').notEmpty(),
	check('postTitle', 'Lenght must be Greater than 3 Words').isLength({
		min: 3,
	}),
	check('postTitle', 'Lenght must be less than 70 Words').isLength({
		max: 70,
	}),
	check('postTitle', 'Title Must Be a String').isString(),
	check('postStory', 'Content Must Be Provided').notEmpty(),
	check('postStory', 'Content Must Be a String').isString(),

	check('postStory', 'Lenght Of content must be Less than 800').isLength({
		max: 800,
	}),
	// check('pic', 'Must have PNG file').notEmpty(),
	check('pic', 'Must have PNG file').custom((value, { req }) => {
		if (!req.files) {
			return false; // return "falsy" value to indicate invalid data
		}

		if (req.files.pic.mimetype === 'image/png') {
			return true; // return "non-falsy" value to indicate valid data"
		}
		return false; // return "falsy" value to indicate invalid data
	}),

	check('tags', 'Select a Proper Tag length > 3').isLength({
		min: 3,
		max: 50,
	}),
];

const checkerForUpdatingData = [
	check(
		'title',
		'Must Have a Title , Lenght must be Greater than 3 Words , < 70 '
	)
		.optional()
		.notEmpty()
		.isLength({
			min: 3,
			max: 70,
		}),

	check('story', 'Content Must Be Provided').notEmpty().optional(),
	check('story', 'Content Must Be a String').isString().optional(),

	check('story', 'Lenght Of content must be Less than 800')
		.isLength({
			max: 800,
		})
		.optional(),
	// check('pic', 'Must have PNG file').notEmpty(),
	check('pic', 'Must have PNG file')
		.optional()
		.notEmpty()
		.custom((value, { req }) => {
			if (req.files.pic.mimetype === 'image/png') {
				return true; // return "non-falsy" value to indicate valid data"
			}
			return false; // return "falsy" value to indicate invalid data
		}),

	check('tags', 'Select a Proper Tag length > 3')
		.optional()
		.notEmpty()
		.isLength({
			min: 3,
			max: 50,
		}),
];

module.exports = {
	checkerForAddingData,
	checkerForUpdatingData,
};
