const adminService = require('./../services/AdminService');
const constants = require('./../utils/constants');

// @route   POST api/admin/addLocationCategory
// @desc    Create location category
// @access  Private
const addLocationCategory = async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  let erro, locationCategory;
  [erro, locationCategory] = await to(adminService.createLocationCategory(req.body));
  if (erro) {
    return ReE(res, 'Thêm mới LC không thành công, vui lòng thử lại sau', 422);
  }
  return ReS(res, {
    message: 'Successfully created new LC.',
  }, 200);
};

module.exports.addLocationCategory = addLocationCategory;

// @route   POST api/admin/addLocation
// @desc    Create public location 
// @access  Private
const addLocation = async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  let erro, location;
  [erro, location] = await to(adminService.createLocation(req.body));
  if (erro) {
    return ReE(res, 'Thêm mới địa điểm không thành công, vui lòng thử lại sau', 422);
  }
  return ReS(res, {
    message: 'Successfully created new location.',
  }, 200);
};

module.exports.addLocation = addLocation;