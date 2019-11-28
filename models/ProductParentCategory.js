const mongoose = require('mongoose');

const productParentCategorySchema = mongoose.Schema({
	name: {
		type: String,
  },
	deletionFlag: {
		type: Boolean,
		default: false,
  },
  ownerId: {
    type: String,
    ref: 'User'
  },
  description: {
    type: String,
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

let ProductParentCategory = module.exports = mongoose.model('ProductParentCategory', productParentCategorySchema);

productParentCategorySchema.pre('save', async function (next) {
	const currTime = new Date().getTime();
	this.updatedAt = currTime;
	if (this.isNew) {
		this.createdAt = currTime;
	}
	next();
});