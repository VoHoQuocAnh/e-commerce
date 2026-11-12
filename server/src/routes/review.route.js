// server/src/routes/review.route.js
const express = require('express');
const reviewController = require('../controllers/review.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { createReviewSchema, listReviewsSchema } = require('../validations/review.validation');

const router = express.Router();

router.get('/product/:productId', validate(listReviewsSchema), reviewController.listReviewsByProduct);
router.post('/', authMiddleware, validate(createReviewSchema), reviewController.createReview);
router.delete('/:id', authMiddleware, reviewController.deleteReview);

module.exports = router;
