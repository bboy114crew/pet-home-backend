const authService = require('./../services/AuthService');
const User = require('../models/User');
const constants = require('../utils/constants');
const phoneService = require('./../services/PhoneService');
const userService = require('./../services/UserService');

const forgotPassword = async function (req, res) {
	if (!req.params.phoneNumber) {
		ReS(res, { message: 'Bad request' }, 400);
	}
	else {
		let objUser = await User.findOne({ phoneNumber: req.params.phoneNumber });

		if (objUser) {
			const newPassword = 'Ph@' + Math.floor(10000 + 89999 * Math.random());
			objUser.set({ password: newPassword });
			let objUserReturn = await objUser.save();
			if (objUserReturn) {
				let [errors, status] = await to(phoneService.sendSMSPassword(req.params.phoneNumber, newPassword));
				if (errors) {
					return ReEM2(res, 'Có lỗi khi gửi message!', 400);
				} else {
					return ReS(res, {
						status: true,
						message: 'Mật khẩu mới đã được gửi tới số điện thoại của bạn!',
					}, 200);
				}
			}
		}
		else {
			return ReEM2(res, 'Số điện thoại không đúng.', 404);
		}
	}
};
module.exports.forgotPassword = forgotPassword;

const getUserById = async function (req, res, next) {
	const userId = req.params.userId;
	if (!userId) {
		ReE(res, {
			status: false,
			message: 'Vui lòng nhập userId',
		}, 400);
	}

	User.find({
		_id: userId,
		deletionFlag: false,
	}, (err, results) => {
		if (err) {
			return ReE(res, err, 500);
		}

		if (results && results.length === 0) {
			return ReE(res, 'Người dùng không tồn tại', 404);
		}
		let user = results[0];
		if (user && user.role === constants.ROLE_LOCATION_MANAGER) {
			ReS(res, {
				status: true,
				user: user.toWeb(),
				locationDetail: null,
			}, 200);
		} else {
			ReS(res, {
				status: true,
				user: user.toWeb(),
			}, 200);
		}
	});
};
module.exports.getUserById = getUserById;

const getAllUsers = async function (req, res, next) {
	User.find({}).where('role').equals(constants.ROLE_USER)
	.exec((err, results) => {
		if (err) {
			return ReE(res, err, 500);
		}
		return ReS(res, {
			status: true,
			users: results
		}, 200);
	});
};
module.exports.getAllUsers = getAllUsers;

const banUserById = async function (req, res, next) {
	User.findByIdAndUpdate(req.body.id, { $set: { deletionFlag: req.body.deletionFlag }}, { new: true }, (err, results) => {
		if (err) {
			return ReE(res, err, 500);
		}
		return ReS(res, {
			message: 'Thay doi thanh cong'
		}, 200);
	});
};
module.exports.banUserById = banUserById;

const getStatusUserById = async (req,res) =>{
	User.findById(req.params.id).select('deletionFlag').exec((err, results) => {
		if (err) {
			return ReE(res, err, 500);
		}
		return ReS(res, {
			message: 'Thay doi thanh cong',
			deletionFlag: results.deletionFlag
		}, 200);
	});
}
module.exports.getStatusUserById =getStatusUserById;
