// server/src/routes/cart.route.js
const express = require('express');
const cartController = require('../controllers/cart.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { addToCartSchema, updateCartItemSchema } = require('../validations/cart.validation');

const router = express.Router();

router.use(authMiddleware);

router.get('/', cartController.getCart);
router.post('/items', validate(addToCartSchema), cartController.addItem);
router.put('/items/:itemId', validate(updateCartItemSchema), cartController.updateItem);
router.delete('/items/:itemId', cartController.removeItem);
router.delete('/', cartController.clearCart);

module.exports = router;
