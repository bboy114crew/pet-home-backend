const LocationCategory = require('./../models/LocationCategory');
const Location = require('./../models/Location');

const createLocationCategory = async (locationCategoryDetail) => {
	[err, locationCategory] = await to(LocationCategory.create(locationCategoryDetail));		
};
module.exports.createLocationCategory = createLocationCategory;

const createLocation = async (locationDetail) => {
	[err, location] = await to(Location.create(locationDetail));		
};
module.exports.createLocation = createLocation;