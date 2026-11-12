// server/src/routes/banner.route.js
const express = require('express');
const { z } = require('zod');
const bannerController = require('../controllers/banner.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');
const ROLES = require('../constants/roles');

const parseBoolean = z.preprocess((val) => {
  if (val === 'true' || val === true) return true;
  if (val === 'false' || val === false) return false;
  return val;
}, z.boolean());

const createBannerSchema = {
  body: z.object({
    title: z.string().trim().min(2).max(150),
    subtitle: z.string().trim().max(255).optional(),
    imageUrl: z.string().trim().url().optional().or(z.literal('')),
    linkUrl: z.string().trim().max(500).optional(),
    sortOrder: z.coerce.number().int().min(0).optional().default(0),
    isActive: parseBoolean.optional().default(true),
  }),
};

const updateBannerSchema = {
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: createBannerSchema.body.partial(),
};

const router = express.Router();

router.get('/', bannerController.listActiveBanners);
router.get('/all', authMiddleware, roleMiddleware(ROLES.ADMIN), bannerController.listAllBanners);
router.post(
  '/',
  authMiddleware,
  roleMiddleware(ROLES.ADMIN),
  upload.single('image'),
  validate(createBannerSchema),
  bannerController.createBanner
);
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(ROLES.ADMIN),
  upload.single('image'),
  validate(updateBannerSchema),
  bannerController.updateBanner
);
router.delete('/:id', authMiddleware, roleMiddleware(ROLES.ADMIN), bannerController.deleteBanner);

module.exports = router;
