const LocationReviewService = require("../services/LocationReviewService");

const getRate = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const locationId = req.params.locationId;
    const result = await LocationReviewService.getRate(locationId);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const addRate = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const review = req.body;
    const result = await LocationReviewService.addRate(review);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

const getAvgRating = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const result = await LocationReviewService.getAvgRating(
      req.params.locationId
    );
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};

module.exports = {
  getRate,
  addRate,
  getAvgRating,
};
