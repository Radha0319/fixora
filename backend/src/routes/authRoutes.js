// AUTH: Authentication router
import { Router } from 'express';
import {
  registerCustomer,
  registerProvider,
  login,
  googleAuth,
  updateProfile,
  getMe,
  changePassword,
  sendPasswordOtp,
  resetPasswordWithOtp
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register/customer', registerCustomer);
router.post('/register/provider', registerProvider);
router.post('/login', login);
router.post('/google', googleAuth);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// Password Change & 4-Digit Verification Code Endpoints
router.post('/change-password', protect, changePassword);
router.post('/send-password-otp', protect, sendPasswordOtp);
router.post('/reset-password-with-otp', protect, resetPasswordWithOtp);

export default router;
