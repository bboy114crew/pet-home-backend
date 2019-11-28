const LocationReview = require("../models/LocationReview");
const Location = require("../models/Location");

const getRate = async locationId => {
  try {
    const result = await LocationReview.find({ locationId }).populate(
      "reviewerId"
    );
    return result;
  } catch (error) {
    throw error;
  }
};

const addRate = async review => {
  try {
    const rated = await isRated(review.locationId, review.reviewerId);
    if (rated) return "Bạn đã đánh giá địa điểm này";
    const rv = new LocationReview(review);
    const result = await LocationReview.create(rv);

    const avgRating = await getAvgRating(review.locationId);
    await setNewAvgRating(review.locationId, Math.round(avgRating));

    return result;
  } catch (error) {
    throw error;
  }
};

const isRated = async (locationId, userId) => {
  try {
    const result = await LocationReview.findOne({
      locationId,
      reviewerId: userId,
    });
    return result;
  } catch (error) {
    throw error;
  }
};

const getAvgRating = async locationId => {
  try {
    const result = await LocationReview.aggregate([
      { $match: { locationId } },
      {
        $group: {
          _id: locationId,
          averageRating: {
            $avg: "$ratingStar",
          },
        },
      },
    ]);
    return result[0].averageRating;
  } catch (error) {
    throw error;
  }
};

const setNewAvgRating = async (locationId, averageRating) => {
  try {
    const result = await Location.findByIdAndUpdate(locationId, {
      $set: {
        systemRating: averageRating,
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getRate,
  addRate,
  getAvgRating,
};
