// server/src/routes/payment.route.js
const express = require('express');
const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/momo/create', authMiddleware, paymentController.createMomoPayment);
router.post('/momo/ipn', paymentController.handleMomoIpn);
router.get('/momo/verify', paymentController.verifyMomoRedirect);

module.exports = router;
