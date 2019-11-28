const mongoose = require('mongoose');

const postCategorySchema = mongoose.Schema({
	name: {
		type: String,
	},
	deletionFlag: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Number,
		default: new Date().getTime(),
	},
	updatedAt: {
		type: Number,
		default: new Date().getTime(),
	},
});

let PostCategory = module.exports = mongoose.model('PostCategory', postCategorySchema);

postCategorySchema.pre('save', async function (next) {
	const currTime = new Date().getTime();
	console.log(this.isNew)
	this.updatedAt = currTime;
	if (this.isNew) {
		this.createdAt = currTime;
	}
	next();
});