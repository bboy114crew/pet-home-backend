const mongoose = require('mongoose');

let ReportSchema = mongoose.Schema({
	reporterId: {
		type: String,
		ref: 'User'
	},
	postId: {
		type: String,
		ref: 'Post'
	},
	description: {
		type: String
	},
	status: {
		type: Number,
		default: 1
	},
	createdAt: {
		type: Number,
		default: new Date().getTime()
	},
	updatedAt: {
		type: Number,
		default: new Date().getTime()
	},
	deletionFlag: {
		type: Boolean,
		default: false
	}
});

let Report = module.exports = mongoose.model('Report', ReportSchema);

ReportSchema.pre('save', async function (next) {
	const currTime = new Date().getTime();
	this.updatedAt = currTime;
	if (this.isNew) {
		this.createdAt = currTime;
	}
	next();
});