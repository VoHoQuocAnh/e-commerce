// server/src/routes/wishlist.route.js
const express = require('express');
const wishlistController = require('../controllers/wishlist.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { toggleWishlistSchema } = require('../validations/wishlist.validation');

const router = express.Router();

router.use(authMiddleware);

router.get('/', wishlistController.getWishlist);
router.post('/toggle', validate(toggleWishlistSchema), wishlistController.toggleWishlist);

module.exports = router;
