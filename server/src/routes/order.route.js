// server/src/routes/order.route.js
const express = require('express');
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { createOrderSchema, cancelOrderSchema } = require('../validations/order.validation');

const router = express.Router();

router.use(authMiddleware);

router.post('/', validate(createOrderSchema), orderController.createOrder);
router.get('/my-orders', orderController.getMyOrders);
router.get('/:orderCode', orderController.getOrderByCode);
router.patch('/:orderCode/cancel', validate(cancelOrderSchema), orderController.cancelOrder);

module.exports = router;
