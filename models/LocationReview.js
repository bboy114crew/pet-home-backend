const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
	message: {
		type: String,
  },
  locationId: {
    type: String,
    ref: 'Location'
  },
  reviewerId: {
    type: String,
    ref: 'User'
  },
  ratingStar: {
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

let Review = module.exports = mongoose.model('LocationReview', reviewSchema);

reviewSchema.pre('save', async function (next) {
	const currTime = new Date().getTime();
	this.updatedAt = currTime;
	if (this.isNew) {
		this.createdAt = currTime;
	}
	next();
});