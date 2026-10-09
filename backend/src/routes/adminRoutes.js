// VERIFY: Administrator review and system oversight routes
import { Router } from 'express';
import {
  getAdminStats,
  getAdminCustomers,
  reviewCustomerVerification,
  getAdminProviders,
  reviewProviderVerification
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';
import { ROLES } from '../config/constants.js';

const router = Router();

router.use(protect);
router.use(restrictTo(ROLES.ADMIN));

router.get('/stats', getAdminStats);
router.get('/customers', getAdminCustomers);
router.patch('/customers/:customerId/review', reviewCustomerVerification);
router.get('/providers', getAdminProviders);
router.patch('/providers/:providerId/review', reviewProviderVerification);

export default router;
