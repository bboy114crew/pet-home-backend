const User = require('../models/User');
const constants = require('../utils/constants');
const banUserService = async (userId, updateOptions) => {
  try {
    const options = {};
    for (const opt of updateOptions) {
      options[opt.propName] = opt.value;
    }
    const result = await User.findByIdAndUpdate(
      userId,
      {
        $set: options,
      },
      {
        new: true,
      }
    );
    return result;
  } catch (error) {
    throw error;
  }
};
module.exports.banUserService = banUserService;
