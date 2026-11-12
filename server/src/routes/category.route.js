// server/src/routes/category.route.js
const express = require('express');
const categoryController = require('../controllers/category.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validateMiddleware');
const ROLES = require('../constants/roles');
const {
  createCategorySchema,
  updateCategorySchema,
} = require('../validations/category.validation');

const router = express.Router();

router.get('/', categoryController.listCategories);
router.get('/:slug', categoryController.getCategoryBySlug);

router.post(
  '/',
  authMiddleware,
  roleMiddleware(ROLES.ADMIN),
  validate(createCategorySchema),
  categoryController.createCategory
);
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(ROLES.ADMIN),
  validate(updateCategorySchema),
  categoryController.updateCategory
);
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(ROLES.ADMIN),
  categoryController.deleteCategory
);

module.exports = router;
