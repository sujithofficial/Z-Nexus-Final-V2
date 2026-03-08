import express from 'express';
import { loginAdmin } from '../controllers/authController.js';
import { getStats } from '../controllers/registrationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/stats', protect, getStats);

export default router;
