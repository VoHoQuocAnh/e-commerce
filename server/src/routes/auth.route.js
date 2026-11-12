// server/src/routes/auth.route.js
const express = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validateMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const { authRateLimiter } = require('../middlewares/rateLimiter');
const {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require('../validations/auth.validation');

const router = express.Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', authRateLimiter, validate(loginSchema), authController.login);
router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);
router.post('/logout', authMiddleware, authController.logout);
router.post(
  '/forgot-password',
  authRateLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword
);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

module.exports = router;
