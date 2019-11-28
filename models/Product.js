const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
	name: {
		type: String,
  },
  ownerId: {
    type: String,
    ref: 'User'
  },
  typeId: { 
    type: String, 
    ref: 'ProductParentCategory'
  },
  images: [{
    type: String
  }],
	deletionFlag: {
		type: Boolean,
		default: false,
  },
  price: {
    type: Number
  },
  description: {
    type: String
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

let Product = module.exports = mongoose.model('Product', productSchema);

productSchema.pre('save', async function (next) {
	const currTime = new Date().getTime();
	this.updatedAt = currTime;
	if (this.isNew) {
		this.createdAt = currTime;
	}
	next();
});