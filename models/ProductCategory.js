const mongoose = require('mongoose');

const productCategorySchema = mongoose.Schema({
	name: {
		type: String,
  },
  typeId: { 
    type: String, 
    ref: 'ProductParentCategory'
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

let ProductCategory = module.exports = mongoose.model('ProductCategory', productCategorySchema);

productCategorySchema.pre('save', async function (next) {
	const currTime = new Date().getTime();
	this.updatedAt = currTime;
	if (this.isNew) {
		this.createdAt = currTime;
	}
	next();
});