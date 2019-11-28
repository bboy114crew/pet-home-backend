const mongoose = require('mongoose');

const rateSchema = mongoose.Schema({
	message: {
		type: String,
  },
  ratedLocationId: {
    type: String,
    ref: 'Location'
  },
  raterId: {
    type: String,
    ref: 'User'
  },
  rateStar: {
    type: Number
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

let Rate = module.exports = mongoose.model('Rate', rateSchema);

rateSchema.pre('save', async function (next) {
	const currTime = new Date().getTime();
	this.updatedAt = currTime;
	if (this.isNew) {
		this.createdAt = currTime;
	}
	next();
});