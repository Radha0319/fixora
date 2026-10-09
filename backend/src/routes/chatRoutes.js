// CHAT: AI Troubleshooter and device category routes
import { Router } from 'express';
import { handleChatDiagnosis, getSupportedCategories } from '../controllers/chatController.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

router.post('/', upload.single('problemImage'), handleChatDiagnosis);
router.get('/categories', getSupportedCategories);

export default router;
