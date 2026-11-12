// server/src/controllers/product.controller.js
const productService = require('../services/product.service');
const ApiResponse = require('../utils/ApiResponse');

const listProducts = async (req, res, next) => {
  try {
    const { items, meta } = await productService.listProducts(req.query);
    return ApiResponse.success(res, { data: items, meta });
  } catch (err) {
    next(err);
  }
};

const getProductBySlug = async (req, res, next) => {
  try {
    const product = await productService.getProductBySlug(req.params.slug);
    return ApiResponse.success(res, { data: product });
  } catch (err) {
    next(err);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    return ApiResponse.success(res, { data: product });
  } catch (err) {
    next(err);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body, req.files);
    return ApiResponse.created(res, 'Tạo sản phẩm thành công', product);
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body, req.files);
    return ApiResponse.success(res, { message: 'Cập nhật sản phẩm thành công', data: product });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id);
    return ApiResponse.success(res, { message: 'Xóa sản phẩm thành công' });
  } catch (err) {
    next(err);
  }
};

const addVariant = async (req, res, next) => {
  try {
    const variant = await productService.addVariant(req.params.id, req.body);
    return ApiResponse.created(res, 'Thêm biến thể thành công', variant);
  } catch (err) {
    next(err);
  }
};

const updateVariant = async (req, res, next) => {
  try {
    const variant = await productService.updateVariant(req.params.id, req.params.variantId, req.body);
    return ApiResponse.success(res, { message: 'Cập nhật biến thể thành công', data: variant });
  } catch (err) {
    next(err);
  }
};

const deleteVariant = async (req, res, next) => {
  try {
    await productService.deleteVariant(req.params.id, req.params.variantId);
    return ApiResponse.success(res, { message: 'Xóa biến thể thành công' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listProducts,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addVariant,
  updateVariant,
  deleteVariant,
};
