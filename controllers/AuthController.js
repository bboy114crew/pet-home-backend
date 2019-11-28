const authService = require('./../services/AuthService');
// Load Input Validation
const validateLoginInput = require('./../validation/login');
const validateRegisterInput = require('./../validation/register');
const User = require('./../models/User');

// @route   GET api/auth/register
// @desc    Register user
// @access  Public
const register = async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  const { errors, isValid } = validateRegisterInput(req.body);
  

  // Check Validation
  if (!isValid) {
    return ReE(res, errors , 400)
  }
  const image = 'https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png';
  let erro, user;
  console.log("Vao day");
  [erro, user] = await to(authService.createUser(req.body, image));
  if (erro) return ReE(res, 'Đăng ký không thành công, vui lòng thử lại sau', 422);
  return ReS(res, {
    message: 'Successfully created new user.',
    user: user.toWeb(),
    token: user.getJWT(),
  }, 200);
};
module.exports.register = register;

const createAdminUser = async function (req, res) {
  const image = 'https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png';
  let erro, user;
  [erro, user] = await to(authService.createUser(req.body, image));
  if (erro) return ReE(res, 'Đăng ký không thành công, vui lòng thử lại sau', 422);
  return ReS(res, {
    message: 'Successfully created new user.',
    user: user.toWeb(),
    token: user.getJWT(),
  }, 200);
}
module.exports.createAdminUser = createAdminUser;

// @route   GET api/auth/login
// @desc    Login User / Returning JWT Token
// @access  Public
const login = async function (req, res) {
  let err, user;
  
  const { errors, isValid } = validateLoginInput(req.body);
  // Check Validation
  if (!isValid) {
    return ReE(res, errors , 400)
  }
	[err, user] = await to(authService.authUser(req.body));
	if (err) return ReEM(res, err, 422);
  res.cookie('ACCESS_TOKEN', user.getJWT(), { maxAge: 900000 });
	return ReS(res, {
		token: user.getJWT(),
		user: user.toWeb(),
	});
};
module.exports.login = login;

const logout = function (req, res) {
	res.clearCookie('ACCESS_TOKEN');
	req.logout();
	res.redirect('/');
};
module.exports.logout = logout;

const changePassword = async function (req, res) {
	let data = req.body;
	let objUpdateUser = await User.findById(data.uid);
	if (!objUpdateUser) {
		ReS(res, { message: 'Not found user' }, 404);
	}
	else {
		let [err, checkPassword] = await to(objUpdateUser.comparePassword(data.password));
		if (err) {
			ReS(res, { message: 'Mật khẩu cũ không chính xác' }, 422);
		}
		else if (checkPassword) {
			let [err, objDuplicatePassword] = await to(objUpdateUser.comparePassword(data.newPassword));
			if (objDuplicatePassword) {
				ReS(res, { message: 'Mật khẩu mới không được trùng password cũ' }, 422);
			} else {
				objUpdateUser.set({ password: data.newPassword });
				await objUpdateUser.save(function (err, updateSuccess) {
					if (err) {
						let changePasswordSuccess = false;
						ReS(res, { message: 'Thay đổi không thành công', changePasswordSuccess: changePasswordSuccess }, 422);
					}
					else {
						let changePasswordSuccess = true;
						ReS(res, { message: 'Thay đổi thành công', changePasswordSuccess: changePasswordSuccess }, 200);
					}
				});
			}
		}
	}
};
module.exports.changePassword = changePassword;
