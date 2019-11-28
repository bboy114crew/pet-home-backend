const locationService = require('../services/LocationService');
const Location = require('../models/Location');
const LocationCategory = require('../models/LocationCategory');
const constants = require('../utils/constants');

// @route   GET api/location/locationCategories
// @desc    Get location category
// @access  Public
const getLocationCategories = async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  let erro, locationCategories;
  [erro, locationCategories] = await to(locationService.getLocationCategories());
  if (erro) {
    return ReE(res, 'Get locationCategories failed', 422);
  }	
  if (locationCategories) {
    return ReS(res, { message: 'Get locationCategories success', locationCategories: locationCategories }, 200);
  }
  else {
    return ReE(res, 'Get locationCategories failed', 503);
  }
};
module.exports.getLocationCategories = getLocationCategories;

// @route   GET api/location/locationCategoriesByType/:type
// @desc    
// @access  Public
const addLocaionByAdmin = async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  try {
    const location = new Location({
      name: req.body.name,
      ownerId: req.body.ownerId,
      typeId: req.body.typeId,
      location: req.body.location,
      address: req.body.address, 
      description: req.body.description,
      images: req.body.images
    });
    let error, loca;
    [error, loca] = await to(Location.create(location));
    return ReS(res, { success: 'success' }, 200);
	} catch (e) {
		return ReE(res, error, 422);
	}
}
module.exports.addLocaionByAdmin = addLocaionByAdmin;

// @route   GET api/location/locationCategoriesByType/:type
// @desc    
// @access  Public
const getLocationCategoriesByType = async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  let erro, locationCategories;
  [erro, locationCategories] = await to(locationService.getLocationCategoriesByType(req.params.type));
  if (erro) {
    return ReE(res, 'Get locationCategories failed', 422);
  }	
  if (locationCategories) {
    return ReS(res, { message: 'Get locationCategories success', locationCategories: locationCategories }, 200);
  }
  else {
    return ReE(res, 'Get locationCategories failed', 503);
  }
};
module.exports.getLocationCategoriesByType = getLocationCategoriesByType;

// @route   PUT api/admin/location/locationCategories
// @desc    
// @access  Public
const updateLocationCategories = async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  try {
    const result = await locationService.updateLocationCategoryById(req.body.id,req.body.field,req.body.value);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};
module.exports.updateLocationCategories = updateLocationCategories;

// @route   GET api/admin/addLocationCategory
// @desc    
// @access  Public
const addLocationCategory = async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  try {
    const result = await locationService.addLocationCategory(req.body.name,req.body.typeLocation);
    // console.log('>> ', result)
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};
module.exports.addLocationCategory = addLocationCategory;

// @route   GET api/location/locationProduct
// @desc    
// @access  Public
const getLocationWithAllProduct = async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  let erro, locationDetail;
  [erro, locationDetail] = await to(locationService.getLocationWithAllProduct(req.query));
  if (erro) {
    return ReE(res, 'Get location and product failed', 422);
  }	
  if (locationDetail) {
    return ReS(res, { message: 'Get location and product success', locationDetail: locationDetail }, 200);
  }
  else {
    return ReE(res, 'Get location and product failed', 503);
  } 				
};
module.exports.getLocationWithAllProduct = getLocationWithAllProduct;

// @route   GET api/location/searchNear/:long/:lat/:radius
// @desc    
// @access  Public
const searchNearByLatLong = async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  let erro, locations;
  [erro, locations] = await to(locationService.searchNearByLatLong(req.params));
  if (erro) {
    return ReE(res, 'Get locations failed', 422);
  }	
  if (locations) {
    return ReS(res, { message: 'Get locations success', locationCategories: locations }, 200);
  }
  else {
    return ReE(res, 'Get locations failed', 503);
  }
};
module.exports.searchNearByLatLong = searchNearByLatLong;

// @route   GET api/location/locationByCategory
// @desc    
// @access  Public
const searchLocationByCategory = async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  let listLocations = [];
  const typeIdArray = req.query.typeIdArray;
  try {
    if(req.query.typeIdArray){
      listLocations = await Location.find({      
        deletionFlag: false,
        hiddenFlag: false,
        $and: [
          { $or : typeIdArray }
        ]
      }).populate({ path: 'typeId' })
      return ReS(res, { listLocations }, 200);
    }
  } catch (e) {
		return ReE(res, error, 422);
	}		
}
module.exports.searchLocationByCategory = searchLocationByCategory;

// @route   GET api/location/searchDist/:long/:lat/:radius
// @desc    
// @access  Public
const searchDist = async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  let long = parseFloat(req.params.long);
  let lat = parseFloat(req.params.lat);
  let radius = parseInt(req.params.radius);
	try {
    let listLocations = await Location.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [ long , lat ] },
          key: "location",
          distanceField: "dist.calculated",
          maxDistance: radius,
          minDistance: 0,
          includeLocs: "dist.location",
          spherical: true
        }
      },
      { "$skip": 0 },
    ]).exec(function (err, docs) {
      LocationCategory.populate(docs, { path: 'typeId' }, function (err, populatedTransactions) {
        if (err) return err;
        const listLocation = populatedTransactions.map(item  => {
          const { _id, location, deletionFlag, address,
            name, typeId, systemRating, description, images, dist, ownerId } = item;
          const { calculated } = dist;
          const { coordinates } = location;
          const coordinate = {
            longitude: coordinates[0],
            latitude: coordinates[1]
          }        
          const distance = calculated.toFixed(0);
          let distanceField;
          if(distance < 1000) {
            distanceField = distance + 'm';
          } else {
            distanceField = (distance / 1000).toFixed(1) + 'km';
          }
          return {
            _id, 
            deletionFlag, 
            address,
            name, 
            typeId, 
            systemRating, 
            description, 
            images, 
            distance: distanceField,
            coordinate,
            ownerId
          }
        }).filter(item => item.deletionFlag !== true);
        return ReS(res, { listLocation }, 200);
      });
    });
	} catch (e) {
		return ReE(res, error, 422);
	}					
};
module.exports.searchDist = searchDist;

// @route   GET api/admin/getAllLocations
// @desc    
// @access  Public
const getAllLocations = async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  let erro, location;
  [erro, location] = await to(locationService.getAllLocations());
  if (erro) {
    return ReE(res, 'Get location failed', 422);
  }	
  if (location) {
    return ReS(res, { message: 'Get location success', locations: location }, 200);
  }
  else {
    return ReE(res, 'Get location failed', 503);
  }

};
module.exports.getAllLocations = getAllLocations;

// @route   GET api/admin/getLocationById/:locationId
// @desc    
// @access  Public
const getLocationById = async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  try {
    const result= await locationService.getLocationById(req.params.locationId);
    return ReS(res, { result }, 200);
  } catch (error) {
    return ReE(res, error, 422);
  }
};
module.exports.getLocationById = getLocationById;

// @route   GET api/location/getAllActiveLocation
// @desc    
// @access  Public
const getAllActiveLocation = async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  let erro, activeLocations;
  [erro, activeLocations] = await to(locationService.getAllActiveLocation());
  if (erro) {
    return ReE(res, 'Get location failed', 422);
  }	
  if (activeLocations) {
    return ReS(res, { message: 'Get location success', activeLocations: activeLocations }, 200);
  }
  else {
    return ReE(res, 'Get location failed', 503);
  }
};
module.exports.getAllActiveLocation = getAllActiveLocation;

// @route   PUT api/admin/hideOrShowLocation
// @desc    
// @access  Public
const hideShowLocation = async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  try {
    const locationId = req.body.id;
    const hiddenFlag = req.body.hiddenFlag;
    const result = await locationService.hideLocationById(locationId, hiddenFlag);
    return ReS(res, { result }, 200);
  } catch (error) {
      return ReE(res, error, 422);
  }
};
module.exports.hideShowLocation = hideShowLocation;

// @route   GET api/location/searchAllLocations
// @desc    
// @access  Public
const searchAllLocations = async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  const search_keyword = req.query.search_keyword;
  const ratingGt = req.query.ratingGt;
  const ratingLt = req.query.ratingLt;
  const radius = parseInt(req.query.radius);
  const lat = parseFloat(req.query.lat);
  const long = parseFloat(req.query.long);
  const typeIdArray = req.query.typeIdArray;
  console.log("typeIdArray");
  console.log(typeIdArray);
  let listLocations = [];
  let listLocationDist = [];

	try {
    if (req.query.search_keyword && req.query.ratingGt && req.query.lat) {
      listLocations = await Location.find({      
          deletionFlag: false,
          hiddenFlag: false,
          $text: { $search: search_keyword }, 
          location : {
            $geoWithin: { $centerSphere: [ [ long, lat ], radius * 0.000621371 / 3963.2] }
          },
          systemRating: { $gte: ratingGt , $lte: ratingLt}
        }
      );
      let result = await Location.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: [ long , lat ] },
            key: "location",
            distanceField: "dist.calculated",
            maxDistance: radius,
            minDistance: 0,
            includeLocs: "dist.location",
            spherical: true
          }
        },
        { "$skip": 0 },
      ]).exec(function (err, docs) {
        LocationCategory.populate(docs, { path: 'typeId' }, function (err, populatedTransactions) {
          if (err) return err;
          listLocationDist = populatedTransactions.map(item  => {
            const { _id, location, deletionFlag, address,
              name, typeId, systemRating, description, images, dist } = item;
            const { calculated } = dist;
            const { coordinates } = location;
            const coordinate = {
              longitude: coordinates[0],
              latitude: coordinates[1]
            }        
            const distance = calculated.toFixed(0);
            let distanceField;
            if(distance < 1000) {
              distanceField = distance + 'm';
            } else {
              distanceField = (distance / 1000).toFixed(1) + 'km';
            }
            return {
              _id, deletionFlag, address,
              name, typeId, systemRating, description, images, distance: distanceField ,coordinate
            }
          });
          let result2 = [];
          for (let index1 = 0; index1 < listLocationDist.length; index1++) {
            for (let index2 = 0; index2 < listLocations.length; index2++) {
              if(listLocationDist[index1]._id.toString() === listLocations[index2]._id.toString()) {
                result2.push(listLocationDist[index1]);                
              }
            }
          }
          return ReS(res, { listLocations: result2 }, 200);
        });
      });
    } else if (req.query.search_keyword && !req.query.lat && !req.query.ratingGt && !req.query.typeIdArray) {
      listLocations = await Location.find({  
          deletionFlag: false,  
          hiddenFlag: false,  
          $text: { $search: search_keyword , $language: 'none', $diacriticSensitive: false, $caseSensitive: false}, 
        }
      ).populate({ path: 'typeId' });
      return ReS(res, { listLocations }, 200);
    } else if (req.query.ratingGt && !req.query.lat && !req.query.search_keyword && !req.query.typeIdArray) {
      listLocations = await Location.find({  
          deletionFlag: false,   
          hiddenFlag: false, 
          systemRating: { $gte: ratingGt , $lte: ratingLt}
        }
      ).populate({ path: 'typeId' });
      return ReS(res, { listLocations }, 200);
    } else if (req.query.search_keyword && req.query.ratingGt && !req.query.lat && !req.query.typeIdArray) {
      listLocations = await Location.find({      
          deletionFlag: false,
          hiddenFlag: false,
          $text: { $search: search_keyword , $language: 'none', $diacriticSensitive: false, $caseSensitive: false},
          systemRating: { $gte: ratingGt , $lte: ratingLt}
        }
      ).populate({ path: 'typeId' });
      return ReS(res, { listLocations }, 200);
    } else if (req.query.ratingGt && req.query.lat && !req.query.search_keyword && !req.query.typeIdArray) {
      listLocations = await Location.find({ 
          deletionFlag: false,  
          hiddenFlag: false,   
          location : {
            $geoWithin: { $centerSphere: [ [ long, lat ], radius * 0.000621371 / 3963.2] }
          },
          systemRating: { $gte: ratingGt , $lte: ratingLt}
        }
      );
      let result = await Location.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: [ long , lat ] },
            key: "location",
            distanceField: "dist.calculated",
            maxDistance: radius,
            minDistance: 0,
            includeLocs: "dist.location",
            spherical: true
          }
        },
        { "$skip": 0 },
      ]).exec(function (err, docs) {
        LocationCategory.populate(docs, { path: 'typeId' }, function (err, populatedTransactions) {
          if (err) return err;
          listLocationDist = populatedTransactions.map(item  => {
            const { _id, location, deletionFlag, address,
              name, typeId, systemRating, description, images, dist } = item;
            const { calculated } = dist;
            const { coordinates } = location;
            const coordinate = {
              longitude: coordinates[0],
              latitude: coordinates[1]
            }        
            const distance = calculated.toFixed(0);
            let distanceField;
            if(distance < 1000) {
              distanceField = distance + 'm';
            } else {
              distanceField = (distance / 1000).toFixed(1) + 'km';
            }
            return {
              _id, deletionFlag, address,
              name, typeId, systemRating, description, images, distance: distanceField ,coordinate
            }
          });
          let result2 = [];
          for (let index1 = 0; index1 < listLocationDist.length; index1++) {
            for (let index2 = 0; index2 < listLocations.length; index2++) {
              if(listLocationDist[index1]._id.toString() === listLocations[index2]._id.toString()) {
                result2.push(listLocationDist[index1]);                
              }
            }
          }
          return ReS(res, { listLocations: result2 }, 200);
        });
      });
    } else if (req.query.search_keyword && req.query.radius && req.query.lat && !req.query.ratingGt && !req.query.typeIdArray){
      listLocations = await Location.find({   
          deletionFlag: false,   
          hiddenFlag: false,
          $text: { $search: search_keyword , $language: 'none', $diacriticSensitive: false, $caseSensitive: false}, 
          location : {
            $geoWithin: { $centerSphere: [ [ long, lat ], radius * 0.000621371 / 3963.2] }
          },
        }
      );
      let result = await Location.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: [ long , lat ] },
            key: "location",
            distanceField: "dist.calculated",
            maxDistance: radius,
            minDistance: 0,
            includeLocs: "dist.location",
            spherical: true
          }
        },
        { "$skip": 0 },
      ]).exec(function (err, docs) {
        LocationCategory.populate(docs, { path: 'typeId' }, function (err, populatedTransactions) {
          if (err) return err;
          listLocationDist = populatedTransactions.map(item  => {
            const { _id, location, deletionFlag, address,
              name, typeId, systemRating, description, images, dist } = item;
            const { calculated } = dist;
            const { coordinates } = location;
            const coordinate = {
              longitude: coordinates[0],
              latitude: coordinates[1]
            }        
            const distance = calculated.toFixed(0);
            let distanceField;
            if(distance < 1000) {
              distanceField = distance + 'm';
            } else {
              distanceField = (distance / 1000).toFixed(1) + 'km';
            }
            return {
              _id, deletionFlag, address,
              name, typeId, systemRating, description, images,distance: distanceField ,coordinate
            }
          });
          let result2 = [];
          for (let index1 = 0; index1 < listLocationDist.length; index1++) {
            for (let index2 = 0; index2 < listLocations.length; index2++) {
              if(listLocationDist[index1]._id.toString() === listLocations[index2]._id.toString()) {
                result2.push(listLocationDist[index1]);                
              }
            }
          }
          return ReS(res, { listLocations: result2 }, 200);
        });
      });
    } else if (req.query.lat && !req.query.ratingGt && !req.query.search_keyword && !req.query.typeIdArray) {
      listLocations = await Location.find({   
          deletionFlag: false, 
          hiddenFlag: false,  
          location : {
            $geoWithin: { $centerSphere: [ [ long, lat ], radius * 0.000621371 / 3963.2] }
          },
        }
      );
      let result = await Location.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: [ long , lat ] },
            key: "location",
            distanceField: "dist.calculated",
            maxDistance: radius,
            minDistance: 0,
            includeLocs: "dist.location",
            spherical: true
          }
        },
        { "$skip": 0 },
      ]).exec(function (err, docs) {
        LocationCategory.populate(docs, { path: 'typeId' }, function (err, populatedTransactions) {
          if (err) return err;
          listLocationDist = populatedTransactions.map(item  => {
            const { _id, location, deletionFlag, address,
              name, typeId, systemRating, description, images, dist } = item;
            const { calculated } = dist;
            const { coordinates } = location;
            const coordinate = {
              longitude: coordinates[0],
              latitude: coordinates[1]
            }        
            const distance = calculated.toFixed(0);
            let distanceField;
            if(distance < 1000) {
              distanceField = distance + 'm';
            } else {
              distanceField = (distance / 1000).toFixed(1) + 'km';
            }
            return {
              _id, deletionFlag, address,
              name, typeId, systemRating, description, images, distance: distanceField ,coordinate
            }
          });
          let result2 = [];
          for (let index1 = 0; index1 < listLocationDist.length; index1++) {
            for (let index2 = 0; index2 < listLocations.length; index2++) {
              if(listLocationDist[index1]._id.toString() === listLocations[index2]._id.toString()) {
                result2.push(listLocationDist[index1]);
              }
            }
          }
          return ReS(res, { listLocations: result2 }, 200);
        });
      });
    } else if (req.query.typeIdArray && !req.query.lat && !req.query.search_keyword && !req.query.ratingGt){
      listLocations = await Location.find({      
        deletionFlag: false,
        hiddenFlag: false,
        $and: [
          { $or : typeIdArray }
        ]
      }).populate({ path: 'typeId' })
      return ReS(res, { listLocations }, 200);
    } else if (req.query.search_keyword && req.query.typeIdArray && !req.query.lat && !req.query.ratingGt){
      listLocations = await Location.find({  
        deletionFlag: false,    
        hiddenFlag: false,
        $text: { $search: search_keyword , $language: 'none', $diacriticSensitive: false, $caseSensitive: false},
        $and: [
          { $or : typeIdArray }
        ]
      }).populate({ path: 'typeId' });
      return ReS(res, { listLocations }, 200);
    } else if (req.query.ratingGt && req.query.typeIdArray && !req.query.lat && !req.query.search_keyword) {
      listLocations = await Location.find({  
          deletionFlag: false,    
          systemRating: { $gte: ratingGt , $lte: ratingLt},
          $and: [
            { $or : typeIdArray }
          ]
        }
      ).populate({ path: 'typeId' });
      return ReS(res, { listLocations }, 200);
    } else if (req.query.search_keyword && req.query.ratingGt && req.query.typeIdArray && !req.query.lat) {
      listLocations = await Location.find({      
          deletionFlag: false,
          hiddenFlag: false,
          $text: { $search: search_keyword , $language: 'none', $diacriticSensitive: false, $caseSensitive: false}, 
          systemRating: { $gte: ratingGt , $lte: ratingLt},
          $and: [
            { $or : typeIdArray }
          ]
        }
      ).populate({ path: 'typeId' });
      return ReS(res, { listLocations }, 200);
    } else if (req.query.typeIdArray && req.query.lat && !req.query.search_keyword && !req.query.ratingGt){
      listLocations = await Location.find({ 
        deletionFlag: false,
        hiddenFlag: false,     
        location : {
          $geoWithin: { $centerSphere: [ [ long, lat ], radius * 0.000621371 / 3963.2] }
        },
        $and: [
          { $or : typeIdArray }
        ]
      }
    );
    let result = await Location.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [ long , lat ] },
          key: "location",
          distanceField: "dist.calculated",
          maxDistance: radius,
          minDistance: 0,
          includeLocs: "dist.location",
          spherical: true
        }
      },
      { "$skip": 0 },
    ]).exec(function (err, docs) {
      LocationCategory.populate(docs, { path: 'typeId' }, function (err, populatedTransactions) {
        if (err) return err;
        listLocationDist = populatedTransactions.map(item  => {
          const { _id, location, deletionFlag, address,
            name, typeId, systemRating, description, images, dist } = item;
          const { calculated } = dist;
          const { coordinates } = location;
          const coordinate = {
            longitude: coordinates[0],
            latitude: coordinates[1]
          }        
          const distance = calculated.toFixed(0);
          let distanceField;
          if(distance < 1000) {
            distanceField = distance + 'm';
          } else {
            distanceField = (distance / 1000).toFixed(1) + 'km';
          }
          return {
            _id, deletionFlag, address,
            name, typeId, systemRating, description, images, distance: distanceField ,coordinate
          }
        });
        let result2 = [];
        for (let index1 = 0; index1 < listLocationDist.length; index1++) {
          for (let index2 = 0; index2 < listLocations.length; index2++) {
            if(listLocationDist[index1]._id.toString() === listLocations[index2]._id.toString()) {
              result2.push(listLocationDist[index1]);                
            }
          }
        }
        return ReS(res, { listLocations: result2 }, 200);
      });
    });
    } else if (req.query.typeIdArray && req.query.lat && !req.query.search_keyword && req.query.ratingGt){
      listLocations = await Location.find({ 
        deletionFlag: false,     
        hiddenFlag: false,
        location : {
          $geoWithin: { $centerSphere: [ [ long, lat ], radius * 0.000621371 / 3963.2] }
        },
        systemRating: { $gte: ratingGt , $lte: ratingLt},
        $and: [
          { $or : typeIdArray }
        ]
      }
    );
    let result = await Location.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [ long , lat ] },
          key: "location",
          distanceField: "dist.calculated",
          maxDistance: radius,
          minDistance: 0,
          includeLocs: "dist.location",
          spherical: true
        }
      },
      { "$skip": 0 },
    ]).exec(function (err, docs) {
      LocationCategory.populate(docs, { path: 'typeId' }, function (err, populatedTransactions) {
        if (err) return err;
        listLocationDist = populatedTransactions.map(item  => {
          const { _id, location, deletionFlag, address,
            name, typeId, systemRating, description, images, dist } = item;
          const { calculated } = dist;
          const { coordinates } = location;
          const coordinate = {
            longitude: coordinates[0],
            latitude: coordinates[1]
          }        
          const distance = calculated.toFixed(0);
          let distanceField;
          if(distance < 1000) {
            distanceField = distance + 'm';
          } else {
            distanceField = (distance / 1000).toFixed(1) + 'km';
          }
          return {
            _id, deletionFlag, address,
            name, typeId, systemRating, description, images, distance: distanceField ,coordinate
          }
        });
        let result2 = [];
        for (let index1 = 0; index1 < listLocationDist.length; index1++) {
          for (let index2 = 0; index2 < listLocations.length; index2++) {
            if(listLocationDist[index1]._id.toString() === listLocations[index2]._id.toString()) {
              result2.push(listLocationDist[index1]);                
            }
          }
        }
        return ReS(res, { listLocations: result2 }, 200);
      });
    });
    } else if (req.query.typeIdArray && req.query.lat && req.query.search_keyword && !req.query.ratingGt){
      listLocations = await Location.find({ 
        deletionFlag: false,    
        hiddenFlag: false, 
        location : {
          $geoWithin: { $centerSphere: [ [ long, lat ], radius * 0.000621371 / 3963.2] }
        },
        $text: { $search: search_keyword , $language: 'none', $diacriticSensitive: false, $caseSensitive: false},
        $and: [
          { $or : typeIdArray }
        ]
      }
    );
    let result = await Location.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [ long , lat ] },
          key: "location",
          distanceField: "dist.calculated",
          maxDistance: radius,
          minDistance: 0,
          includeLocs: "dist.location",
          spherical: true
        }
      },
      { "$skip": 0 },
    ]).exec(function (err, docs) {
      LocationCategory.populate(docs, { path: 'typeId' }, function (err, populatedTransactions) {
        if (err) return err;
        listLocationDist = populatedTransactions.map(item  => {
          const { _id, location, deletionFlag, address,
            name, typeId, systemRating, description, images, dist } = item;
          const { calculated } = dist;
          const { coordinates } = location;
          const coordinate = {
            longitude: coordinates[0],
            latitude: coordinates[1]
          }        
          const distance = calculated.toFixed(0);
          let distanceField;
          if(distance < 1000) {
            distanceField = distance + 'm';
          } else {
            distanceField = (distance / 1000).toFixed(1) + 'km';
          }
          return {
            _id, deletionFlag, address,
            name, typeId, systemRating, description, images, distance: distanceField ,coordinate
          }
        });
        let result2 = [];
        for (let index1 = 0; index1 < listLocationDist.length; index1++) {
          for (let index2 = 0; index2 < listLocations.length; index2++) {
            if(listLocationDist[index1]._id.toString() === listLocations[index2]._id.toString()) {
              result2.push(listLocationDist[index1]);                
            }
          }
        }
        return ReS(res, { listLocations: result2 }, 200);
      });
    });
    } else if (req.query.typeIdArray && !req.query.lat && req.query.search_keyword && req.query.ratingGt){
      listLocations = await Location.find({      
        deletionFlag: false,
        hiddenFlag: false,
        $text: { $search: search_keyword , $language: 'none', $diacriticSensitive: false, $caseSensitive: false},
        systemRating: { $gte: ratingGt , $lte: ratingLt},
        $and: [
          { $or : typeIdArray }
        ]
      }
      ).populate({ path: 'typeId' });
      return ReS(res, { listLocations }, 200);
    } else if (req.query.typeIdArray && req.query.lat && req.query.search_keyword && req.query.ratingGt){
      listLocations = await Location.find({ 
        deletionFlag: false,   
        hiddenFlag: false,  
        location : {
          $geoWithin: { $centerSphere: [ [ long, lat ], radius * 0.000621371 / 3963.2] }
        },
        $text: { $search: search_keyword , $language: 'none', $diacriticSensitive: false, $caseSensitive: false},
        systemRating: { $gte: ratingGt , $lte: ratingLt},
        $and: [
          { $or : typeIdArray }
        ]
      }
    );
    let result = await Location.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [ long , lat ] },
          key: "location",
          distanceField: "dist.calculated",
          maxDistance: radius,
          minDistance: 0,
          includeLocs: "dist.location",
          spherical: true
        }
      },
      { "$skip": 0 },
    ]).exec(function (err, docs) {
      LocationCategory.populate(docs, { path: 'typeId' }, function (err, populatedTransactions) {
        if (err) return err;
        listLocationDist = populatedTransactions.map(item  => {
          const { _id, location, deletionFlag, address,
            name, typeId, systemRating, description, images, dist } = item;
          const { calculated } = dist;
          const { coordinates } = location;
          const coordinate = {
            longitude: coordinates[0],
            latitude: coordinates[1]
          }        
          const distance = calculated.toFixed(0);
          let distanceField;
          if(distance < 1000) {
            distanceField = distance + 'm';
          } else {
            distanceField = (distance / 1000).toFixed(1) + 'km';
          }
          return {
            _id, deletionFlag, address,
            name, typeId, systemRating, description, images, distance: distanceField ,coordinate
          }
        });
        let result2 = [];
        for (let index1 = 0; index1 < listLocationDist.length; index1++) {
          for (let index2 = 0; index2 < listLocations.length; index2++) {
            if(listLocationDist[index1]._id.toString() === listLocations[index2]._id.toString()) {
              result2.push(listLocationDist[index1]);                
            }
          }
        }
        return ReS(res, { listLocations: result2 }, 200);
      });
    });
    }
	} catch (e) {
		return ReE(res, e, 422);
	}					
};
module.exports.searchAllLocations = searchAllLocations;

// @route   PUT api/admin/location/locationCategories
// @desc    
// @access  Public
const updateLocation = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  let error, locationProfile;
  [error, locationProfile] = await to(locationService.updateLocation(req.body));
  if (error) return ReE(res, 'Không cập nhật địa điểm', 422);
  return ReS(res, {
    message: 'Update location successfully',
    locationProfile: locationProfile
  }, 200);
}
module.exports.updateLocation = updateLocation;

// @route   GET api/location/profile/:id
// @desc    Get location by user_id
// @access  Public
const getLocationProfile = async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  let erro, locationProfile;
  [erro, locationProfile] = await to(locationService.getLocationProfile(req.params.ownerId));
  if (erro) {
    return ReE(res, 'Get getLocationProfile failed', 422);
  }	
  if (locationProfile) {
    return ReS(res, { 
      message: 'Get getLocationProfile success', 
      locationProfile: locationProfile 
    }, 200);
  }
  else {
    return ReE(res, 'Get getLocationProfile failed', 503);
  } 				
};
module.exports.getLocationProfile = getLocationProfile;

// @route   GET api/location/locationCategoriesWithType
// @desc    
// @access  Public
const getLocationCategoriesWithType = async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  try {
    const list = await LocationCategory.find({ hiddenFlag: false});
    const listPrivates = list.filter( item => item.typeLocation === constants.PRIVATE_LOCATION);
    const listPublics = list.filter( item => item.typeLocation === constants.PUBLIC_LOCATION);
    return ReS(res, { locationCategories: {listPrivates : listPrivates, listPublics: listPublics }}, 200);
	} catch (e) {
		return ReE(res, error, 422);
	}
}
module.exports.getLocationCategoriesWithType = getLocationCategoriesWithType;

const deleteLocationByAdmin = async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  let error, locationProfile;
  [error, locationProfile] = await to(locationService.deleteLocationByAdmin(req.body));
  if (error) return ReE(res, 'Không cập nhật địa điểm', 422);
  return ReS(res, {
    message: 'Update location successfully',
    locationProfile: locationProfile
  }, 200);
}
module.exports.deleteLocationByAdmin = deleteLocationByAdmin;

