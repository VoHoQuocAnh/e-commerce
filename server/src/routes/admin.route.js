// server/src/routes/admin.route.js
const express = require('express');
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validateMiddleware');
const ROLES = require('../constants/roles');
const { adminUpdateOrderStatusSchema } = require('../validations/order.validation');
const { adminUpdateUserSchema } = require('../validations/user.validation');

const router = express.Router();

router.use(authMiddleware, roleMiddleware(ROLES.ADMIN));

router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/orders', adminController.listAllOrders);
router.patch(
  '/orders/:id/status',
  validate(adminUpdateOrderStatusSchema),
  adminController.updateOrderStatus
);
router.get('/users', adminController.listUsers);
router.patch('/users/:id/role', validate(adminUpdateUserSchema), adminController.updateUser);

module.exports = router;
