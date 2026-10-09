// VERIFY: Service provider routes for registration, verification and search
import { Router } from 'express';
import {
  getMyProviderProfile,
  registerFace,
  uploadProviderDocuments,
  updateProviderExpertise,
  searchProviders,
  getPublicProviderProfile
} from '../controllers/providerController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { ROLES } from '../config/constants.js';

const router = Router();

// Provider-only private management endpoints
router.get('/profile', protect, restrictTo(ROLES.PROVIDER), getMyProviderProfile);
router.post('/face-registration', protect, restrictTo(ROLES.PROVIDER), upload.single('faceImage'), registerFace);
router.post('/documents', protect, restrictTo(ROLES.PROVIDER), upload.single('document'), uploadProviderDocuments);
router.patch('/expertise', protect, restrictTo(ROLES.PROVIDER), updateProviderExpertise);

// Search and public inspection (Customer access is gated inside controller via rule #12)
router.get('/search', protect, searchProviders);
router.get('/:id', protect, getPublicProviderProfile);

export default router;
