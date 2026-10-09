// DB: Service request lifecycle router
import { Router } from 'express';
import {
  createServiceRequest,
  getMyServiceRequests,
  getServiceRequestById,
  updateServiceRequestStatus
} from '../controllers/serviceRequestController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

router.use(protect);

router.post('/', upload.single('problemImage'), createServiceRequest);
router.get('/', getMyServiceRequests);
router.get('/:id', getServiceRequestById);
router.patch('/:id/status', updateServiceRequestStatus);

export default router;
