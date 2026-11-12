// server/src/routes/index.js
const express = require('express');
const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');
const categoryRoutes = require('./category.route');
const productRoutes = require('./product.route');
const reviewRoutes = require('./review.route');
const cartRoutes = require('./cart.route');
const wishlistRoutes = require('./wishlist.route');
const couponRoutes = require('./coupon.route');
const bannerRoutes = require('./banner.route');
const orderRoutes = require('./order.route');
const paymentRoutes = require('./payment.route');
const adminRoutes = require('./admin.route');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'CALEM STUDIO API is running',
    data: { timestamp: new Date().toISOString() },
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/reviews', reviewRoutes);
router.use('/cart', cartRoutes);
router.use('/wishlists', wishlistRoutes);
router.use('/coupons', couponRoutes);
router.use('/banners', bannerRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
