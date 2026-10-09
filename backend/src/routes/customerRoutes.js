// VERIFY: Customer profile and verification routes
import { Router } from 'express';
import {
  getCustomerProfile,
  submitAadhaarVerification,
  updateCustomerAddress
} from '../controllers/customerController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { ROLES } from '../config/constants.js';

const router = Router();

router.use(protect);
router.use(restrictTo(ROLES.CUSTOMER));

router.get('/profile', getCustomerProfile);
router.post('/verification', upload.single('document'), submitAadhaarVerification);
router.patch('/address', updateCustomerAddress);

export default router;
