// server/src/controllers/category.controller.js
const categoryService = require('../services/category.service');
const ApiResponse = require('../utils/ApiResponse');

const listCategories = async (req, res, next) => {
  try {
    const includeInactive = req.query.includeInactive === 'true';
    const categories = await categoryService.listCategories({ includeInactive });
    return ApiResponse.success(res, { data: categories });
  } catch (err) {
    next(err);
  }
};

const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryBySlug(req.params.slug);
    return ApiResponse.success(res, { data: category });
  } catch (err) {
    next(err);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body);
    return ApiResponse.created(res, 'Tạo danh mục thành công', category);
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    return ApiResponse.success(res, { message: 'Cập nhật danh mục thành công', data: category });
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    return ApiResponse.success(res, { message: 'Xóa danh mục thành công' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
