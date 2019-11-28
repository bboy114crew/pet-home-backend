const mongoose = require('mongoose');

let childRecords = mongoose.Schema({
	recorderID: {type: String, ref: 'User'},
	type: {type: Number},
	value: {type: String},
	createdAt: {
		type: Number,
		default: new Date().getTime()
	}
});

let messageSchema = mongoose.Schema({
	userAId: {type: String, ref: 'User'},
	userBId: {type: String, ref: 'User'},
	records: [childRecords],
	createdAt: {
		type: Number,
		default: new Date().getTime()
	},
	updatedAt: {
		type: Number,
		default: new Date().getTime()
	},
	deletionFlag: {type: Number, default: 1}
});

let Message = module.exports = mongoose.model('Message', messageSchema);

messageSchema.pre('save', async function (next) {
	const currTime = new Date().getTime();
	this.updatedAt = currTime;
	if (this.isNew) {
		this.createdAt = currTime;
	}
	next();
});

childRecords.pre('save', async function (next) {
	const currTime = new Date().getTime();
	if (this.isNew) {
		this.createdAt = currTime;
	}
	next();
});