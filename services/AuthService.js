const User = require('./../models/User');
const Location = require('./../models/Location');
const validator = require('validator');
const constants = require('./../utils/constants');

const createUser = async (userDetail, avatar) => {
  userDetail.avatar = avatar;
	let auth_info;
	auth_info = {};
  auth_info.status = 'create';
	if (validator.isMobilePhone(userDetail.phoneNumber, 'any')) {
		auth_info.method = 'phone';
    let err,user;
    console.log("userDetail");
    console.log(userDetail);
		[err, user] = await to(User.create(userDetail));
		if (err) TE('Số điện thoại đã được đăng ký');
		if (user.role === constants.ROLE_USER) {
			// To do
		}
		if (user.role === constants.ROLE_LOCATION_MANAGER) {
      console.log("ROLE_LOCATION_MANAGER");
			let location = new Location({
				name: userDetail.name,
				ownerId: user._id,
				typeId: userDetail.typeId,
				location: userDetail.location,
				address: userDetail.address
      });
      console.log(location);
			let error, loca;
			[error, loca] = await to(Location.create(location));
			if (error) {
				TE('Error save location');
			}
    }
    if (user.role === constants.ROLE_ADMIN) {
      // To do
    }
		return user;
	} else {
		TE('A valid phone number was not entered.');
	}
};
module.exports.createUser = createUser;

const authUser = async (userInfo) => { //returns token
	let auth_info = {};
	auth_info.status = 'login';
	if (!userInfo.phone || !userInfo.password) TE('Vui lòng nhập số điện thoại và mật khẩu để đăng nhập');
	let user;
	if (validator.isMobilePhone(userInfo.phone, 'any')) { //checks if only phone number was sent
		auth_info.method = 'phone';
		[err, user] = await to(User.findOne({
			phoneNumber: userInfo.phone,
		}));
		if (err) TE('Số điện thoại chưa được đăng ký');

	} else {
		TE('Vui lòng nhập 1 số điện thoại di động tại Việt Nam');
	}
	if (!user) TE('Số điện thoại chưa được đăng ký');
	[err, user] = await to(user.comparePassword(userInfo.password));
	if (err) TE('Mật khẩu không chính xác');
	return user;
};
module.exports.authUser = authUser;

const changePassword = async (userInfo) => { //returns token
	let user;
	[err, user] = await to(User.findById(userInfo.uid));
	[err, user] = await to(user.comparePassword(userInfo.password));
	if (err) TE('Mật khẩu cũ không chính xác');
	else
		[err, user] = await to(User.findByIdAndUpdate(userInfo.uid, {password: userInfo.newPassword}));
	return user;
};
module.exports.changePassword = changePassword;