const mongoose = require('mongoose');

const locationCategorySchema = mongoose.Schema({
	name: {
		type: String,
  },
  typeLocation: {
    type: Number
  },
	hiddenFlag: {
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
  deletionFlag: {
		type: Boolean,
		default: false,
	},
});

let LocationCategory = module.exports = mongoose.model('LocationCategory', locationCategorySchema);

locationCategorySchema.pre('save', async function (next) {
	const currTime = new Date().getTime();
	this.updatedAt = currTime;
	if (this.isNew) {
		this.createdAt = currTime;
	}
	next();
});