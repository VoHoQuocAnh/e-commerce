// server/src/routes/user.route.js
const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');
const { updateProfileSchema, changePasswordSchema } = require('../validations/user.validation');
const {
  createAddressSchema,
  updateAddressSchema,
  addressIdParamSchema,
} = require('../validations/address.validation');

const router = express.Router();

router.use(authMiddleware);

router.get('/me', userController.getMe);
router.put(
  '/me',
  upload.single('avatar'),
  validate(updateProfileSchema),
  userController.updateMe
);
router.put('/me/password', validate(changePasswordSchema), userController.changePassword);

router.get('/me/addresses', userController.listMyAddresses);
router.post('/me/addresses', validate(createAddressSchema), userController.createMyAddress);
router.put('/me/addresses/:id', validate(updateAddressSchema), userController.updateMyAddress);
router.delete(
  '/me/addresses/:id',
  validate(addressIdParamSchema),
  userController.deleteMyAddress
);
router.patch(
  '/me/addresses/:id/default',
  validate(addressIdParamSchema),
  userController.setDefaultMyAddress
);

module.exports = router;
