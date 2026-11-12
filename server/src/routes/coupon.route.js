// server/src/routes/coupon.route.js
const express = require('express');
const couponController = require('../controllers/coupon.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validateMiddleware');
const ROLES = require('../constants/roles');
const {
  applyCouponSchema,
  createCouponSchema,
  updateCouponSchema,
} = require('../validations/coupon.validation');

const router = express.Router();

router.post('/apply', authMiddleware, validate(applyCouponSchema), couponController.applyCoupon);

router.get('/', authMiddleware, roleMiddleware(ROLES.ADMIN), couponController.listCoupons);
router.post(
  '/',
  authMiddleware,
  roleMiddleware(ROLES.ADMIN),
  validate(createCouponSchema),
  couponController.createCoupon
);
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(ROLES.ADMIN),
  validate(updateCouponSchema),
  couponController.updateCoupon
);
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(ROLES.ADMIN),
  couponController.deleteCoupon
);

module.exports = router;
