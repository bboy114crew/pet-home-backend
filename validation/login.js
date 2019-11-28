const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.phone = !isEmpty(data.phone) ? data.phone : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if (!Validator.isMobilePhone(data.phone)) {
    errors.phone = 'Số điện thoại không hợp lệ';
  }

  if (Validator.isEmpty(data.phone)) {
    errors.phone = 'Bạn chưa nhập số điện thoại';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Bạn chưa nhập mật khẩu';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
