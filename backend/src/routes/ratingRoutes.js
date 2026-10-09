// DB: Ratings and reviews router
import { Router } from 'express';
import { submitRating, getProviderReviews } from '../controllers/ratingController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';
import { ROLES } from '../config/constants.js';

const router = Router();

router.post('/', protect, restrictTo(ROLES.CUSTOMER), submitRating);
router.get('/provider/:providerId', getProviderReviews);

export default router;
