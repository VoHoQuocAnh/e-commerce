// server/src/routes/product.route.js
const express = require('express');
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');
const ROLES = require('../constants/roles');
const {
  listProductsSchema,
  createProductSchema,
  updateProductSchema,
  createVariantSchema,
  updateVariantSchema,
} = require('../validations/product.validation');

const router = express.Router();

router.get('/', validate(listProductsSchema), productController.listProducts);
router.get('/id/:id', authMiddleware, roleMiddleware(ROLES.ADMIN), productController.getProductById);
router.get('/:slug', productController.getProductBySlug);

router.post(
  '/',
  authMiddleware,
  roleMiddleware(ROLES.ADMIN),
  upload.array('images', 8),
  validate(createProductSchema),
  productController.createProduct
);
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(ROLES.ADMIN),
  upload.array('images', 8),
  validate(updateProductSchema),
  productController.updateProduct
);
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(ROLES.ADMIN),
  productController.deleteProduct
);

router.post(
  '/:id/variants',
  authMiddleware,
  roleMiddleware(ROLES.ADMIN),
  validate(createVariantSchema),
  productController.addVariant
);
router.put(
  '/:id/variants/:variantId',
  authMiddleware,
  roleMiddleware(ROLES.ADMIN),
  validate(updateVariantSchema),
  productController.updateVariant
);
router.delete(
  '/:id/variants/:variantId',
  authMiddleware,
  roleMiddleware(ROLES.ADMIN),
  productController.deleteVariant
);

module.exports = router;
