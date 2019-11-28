const productService = require('../services/ProductService')

const getProduct = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  let error, product;
  [error, product] = await to(productService.getProduct(req.params.uid));
  if (error) {
    return ReE(res, 'Get product failed', 422);
  }
  if (product) {
    return ReS(res, { message: 'Get product success', product: product }, 200);
  }
  else {
    return ReE(res, 'Get product failed', 503);
  }
}
module.exports.getProduct = getProduct;

const addProduct = async (req, res)=> {
  res.setHeader('Content-Type', 'application/json');
  const image = 'https://www.touchtaiwan.com/images/default.jpg';
  let error, product;
  [error, product] = await to(productService.createProduct(req.body, image));
  if (error) return ReE(res, 'Không thể tạo thêm sản phẩm', 422);
  return ReS(res, {
    message: 'Create new product successfully'
  }, 200);
}

module.exports.addProduct = addProduct;


const deleteProduct = async (req, res)=> {
  res.setHeader('Content-Type', 'application/json');
  let error, product;
  [error, product] = await to(productService.deleteProduct(req.body));
  if (error) return ReE(res, 'Không thể xóa thêm sản phẩm', 422);
  return ReS(res, {
    message: 'Xóa thành công'
  }, 200);
}
module.exports.deleteProduct = deleteProduct;

const updateProduct = async (req, res)=> {
  res.setHeader('Content-Type', 'application/json');
  let error, product;
  [error, product] = await to(productService.updateProduct(req.body));
  if (error) return ReE(res, 'Không thể update sản phẩm', 422);
  return ReS(res, {
    message: 'Update product successfully'
  }, 200);
}
module.exports.updateProduct = updateProduct;

const getProductDetailById = async (req, res)=> {
  res.setHeader('Content-Type', 'application/json');
  let error, productDetail;
  [error, productDetail] = await to(productService.getProductById(req.params.id));
  if (error) return ReE(res, 'Không thể lấy thêm sản phẩm', 422);
  return ReS(res, {
    productDetail: productDetail,
    message: 'Lấy thành công'
  }, 200);
}
module.exports.getProductDetailById = getProductDetailById;

const getProductDetailByIdForApp = async (req, res)=> {
  res.setHeader('Content-Type', 'application/json');
  console.log("Vao day")
  let error, productDetailForApp;
  [error, productDetailForApp] = await to(productService.getProductByIdForApp(req.query.id));
  if (error) return ReE(res, 'Không thể lấy sản phẩm', 422);
  return ReS(res, {
    productDetailForApp: productDetailForApp,
    message: 'Lấy thành công'
  }, 200);
}
module.exports.getProductDetailByIdForApp = getProductDetailByIdForApp;

const getProductInOneCategories = async (req, res)=> {
  res.setHeader('Content-Type', 'application/json');
  let error, productInOneCategories;
  [error, productInOneCategories] = await to(productService.getProductInOneCategories(req.query.typeId));
  if (error) return ReE(res, 'Không thể get thêm sản phẩm', 422);
  return ReS(res, {
    productInOneCategories: productInOneCategories,
    message: 'Lấy thành công'
  }, 200);
}
module.exports.getProductInOneCategories = getProductInOneCategories;

const getProductParentCategories = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const ownerId = req.params.ownerId;
  let erro, productParentCategories;
  [erro, productParentCategories] = await to(productService.getProductParentCategories(ownerId));
  if (erro) {
    return ReE(res, 'Get productParentCategories failed', 422);
  }	
  if (productParentCategories) {
    return ReS(res, { message: 'Get productParentCategories success', productParentCategories: productParentCategories }, 200);
  }
  else {
    return ReE(res, 'Get productParentCategories failed', 503);
  }
};
module.exports.getProductParentCategories = getProductParentCategories;

const getProductParentCategoriesProduct = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const ownerId = req.params.ownerId;
  let erro, productParentCategories;
  [erro, productParentCategories] = await to(productService.getProductParentCategoriesProduct(ownerId));
  if (erro) {
    return ReE(res, 'Get productParentCategories failed', 422);
  }	
  if (productParentCategories) {
    return ReS(res, { message: 'Get productParentCategories success', productParentCategories: productParentCategories }, 200);
  }
  else {
    return ReE(res, 'Get productParentCategories failed', 503);
  }
};
module.exports.getProductParentCategoriesProduct = getProductParentCategoriesProduct;

const getProductByIds = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const ownerId = req.params.ownerId;
  let erro, productByIds;
  [erro, productByIds] = await to(productService.getProductByIds(ownerId));
  if (erro) {
    return ReE(res, 'Get productByIds failed', 422);
  }	
  if (productByIds) {
    return ReS(res, { message: 'Get productByIds success', productByIds: productByIds }, 200);
  }
  else {
    return ReE(res, 'Get productByIds failed', 503);
  }
  				
};
module.exports.getProductByIds = getProductByIds;


const addProductParentCategory = async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  let erro, addProductParentCategory;
  [erro, addProductParentCategory] = await to(productService.createProductParentCategory(req.body));
  if (erro) {
    return ReE(res, 'Thêm mới PPC không thành công, vui lòng thử lại sau', 422);
  }
  return ReS(res, {
    message: 'Successfully created new PPC.',
  }, 200);				
};
module.exports.addProductParentCategory = addProductParentCategory;


const updateProductParentCategory = async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  let erro, updateProductParentCategory;
  [erro, updateProductParentCategory] = await to(productService.updateProductParentCategory(req.body));
  if (erro) {
    return ReE(res, 'Thêm mới PPC không thành công, vui lòng thử lại sau', 422);
  }
  return ReS(res, {
    message: 'Successfully created new PPC.',
  }, 200);				
};
module.exports.updateProductParentCategory = updateProductParentCategory;
