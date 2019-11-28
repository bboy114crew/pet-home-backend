const Product = require('./../models/Product');
const ProductParentCategory = require('./../models/ProductParentCategory');

const createProduct = async (productDetail, image) => {
  let images = []
  if (productDetail.images.length < 1) {
    images = [image]
  } else {
    images = productDetail.images
  }
  let productAdd = new Product({
    name: productDetail.name,
    ownerId: productDetail.ownerId,
    typeId: productDetail.typeId,
    description: productDetail.description,
    price: productDetail.price,
    images: images
  });
  [error, product] = await to(Product.create(productAdd));
  if (error) TE(error);
}
module.exports.createProduct= createProduct;

const updateProduct = async (productDetail) => {
  [error, product] = await to(Product.findByIdAndUpdate(productDetail.id,productDetail));
  if (error) TE(error);
}
module.exports.updateProduct= updateProduct;


const getProductParentCategories = async (ownerId) => {
	try {
    let getProductCategoryList = await ProductParentCategory.find({ ownerId: ownerId});
		return getProductCategoryList;
	}
	catch (e) {
		return TE(res, 'Get productParentCategories failed', 503);
	}
};
module.exports.getProductParentCategories = getProductParentCategories;

const getProductParentCategoriesProduct = async (ownerId) => {
	try {
    let getProductCategoryList = await ProductParentCategory.find({ ownerId: ownerId, deletionFlag: false});
		return getProductCategoryList;
	}
	catch (e) {
		return TE(res, 'Get productParentCategories failed', 503);
	}
};
module.exports.getProductParentCategoriesProduct = getProductParentCategoriesProduct;

const getProductByIds = async (ownerId,name) => {
	try {
    let getProductByIdList = await Product.find({ deletionFlag: false, ownerId: ownerId}).populate("typeId");
		return getProductByIdList;
	}
	catch (e) {
		return TE(res, 'Get productByIds failed', 503);
	}
};
module.exports.getProductByIds = getProductByIds;

const createProductParentCategory = async (productParentCategoryDetail) => {
	let productParentCategory, err;
	[err, productParentCategory] = await to(ProductParentCategory.create(productParentCategoryDetail));		
};
module.exports.createProductParentCategory = createProductParentCategory;

const updateProductParentCategory = async (productParentCategoryDetail) => {
	let productParentCategory, err;
	[err, productParentCategory] = await to(ProductParentCategory.findByIdAndUpdate(productParentCategoryDetail.id,productParentCategoryDetail));		
};
module.exports.updateProductParentCategory = updateProductParentCategory;

//product delete
const deleteProduct = async (productDetail) => {
	let product, err;
	[err, product] = await to(Product.findByIdAndDelete(productDetail.id));		
};
module.exports.deleteProduct = deleteProduct;

const getProductById = async (id) => {
	try {
    let productDetail = await Product.findById(id)
		return productDetail;
	}
	catch (e) {
		return TE(res, 'Get productByIds failed', 503);
	}
};
module.exports.getProductById = getProductById;

const getProductByIdForApp = async id => {
	try {
    let productDetailForApp = await Product.findById(id).populate({path: 'typeId'});
		return productDetailForApp;
	}
	catch (e) {
		return TE(res, 'Get productByIds failed', 503);
	}
};
module.exports.getProductByIdForApp = getProductByIdForApp;

const getProductInOneCategories = async (typeId) => {
	try {
    let productInOneCategories = await Product.find({typeId: typeId}).populate({path: 'typeId'});
		return productInOneCategories;
	}
	catch (e) {
		return TE(res, 'Get getProductInOneCategories failed', 503);
	}
};
module.exports.getProductInOneCategories = getProductInOneCategories;

