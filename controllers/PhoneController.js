const phoneService = require('./../services/PhoneService');
const PhoneVerification = require('../models/PhoneVerification');

// @route   POST api/phone/sms
// @desc    Send code by sms to user
// @access  Public
const sendPhoneVerifyCode = async function (req, res) {
	res.setHeader('Content-Type', 'application/json');
  const body = req.body;
	const vietnamesePhoneRegex = /(03|09|01[2|6|8|9])+([0-9]{8})\b/;
	if (!body.phone) {
    return ReEM(res, 'Vui lòng nhập số điện thoại để xác minh', 400);
	} else {
    if (!vietnamesePhoneRegex.test(body.phone)) {
      return ReEM(res, 'Số điện thoại của bạn không hợp lệ', 400);
    } else {
      let errors, status;
      [errors, status] = await to(phoneService.sendSMSVerification(body.phone));
      if (errors) {
        return ReEM(res, 'Gửi SMS không thành công', 400);
      } else {
        return ReS(res, {
          status: 'success',
          message: 'Mã code đã gửi đến bạn thành công xin đợi trong giây lát',
          phone: body.phone
        }, 200);
      }
    }
  }
};
module.exports.sendPhoneVerifyCode = sendPhoneVerifyCode;

// @route   POST api/phone/verify
// @desc    Vertify code of user
// @access  Public
const verifyPhoneVerifyCode = async function (req, res) {
	res.setHeader('Content-Type', 'application/json');
	const body = req.body;
	if (!body.phone || !body.code) {
		return ReEM2(res, 'Vui lòng nhập số điện thoại và code');
	} else {
		PhoneVerification.find({
			phoneNumber: body.phone,
			code: body.code
		}, (err, results) => {
			if (err) {
				return ReE(res, err, 500);
			}
			if (results && results.length === 0) {
				return ReEM2(res, 'Mã code không chính xác', 400);
			}
			const phone = results[0];
			// if(new Date().getTime() - new Date(phone.updatedAt).getTime() > CONFIG.EXPIRATION_SMS_CODE){

			// 	return ReEM2(res, 'Mã code đã hết hạn', 400);
			// }
			return ReS(res, {
				status: 'success',
				message: 'Thành công'
			}, 200);

		});
	}
};
module.exports.verifyPhoneVerifyCode = verifyPhoneVerifyCode;
