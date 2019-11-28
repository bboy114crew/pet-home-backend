require('./../config/config');
const cloudinary = require('cloudinary');

cloudinary.config({ 
  cloud_name: CONFIG.CLOUD_NAME,
  api_key: CONFIG.API_KEY, 
  api_secret: CONFIG.API_SECRET
})

const uploadImage = async (req, res) => {
  const values = Object.values(req.files)
  const promises = values.map(image => cloudinary.uploader.upload(image.path))
  
  Promise
    .all(promises)
    .then(results => res.json(results))
    .catch((err) => res.status(400).json(err))
}
module.exports.uploadImage = uploadImage;