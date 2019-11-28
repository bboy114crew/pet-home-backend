const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';
  data.address = !isEmpty(data.address) ? data.address : '';

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Bạn chưa nhập mật khẩu';
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Mật khẩu ít nhất 6 kí tự và nhiều nhất 30 kí tự.';
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = 'Bận chưa nhập mật khẩu lần 2';
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = 'Mật khẩu không trùng khớp';
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Bạn chưa nhập tên địa điểm';
  }

  if (Validator.isEmpty(data.address)) {
    errors.address = 'Bạn chưa nhập địa chỉ';
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
