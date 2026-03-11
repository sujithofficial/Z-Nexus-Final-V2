import express from 'express';
import { loginAdmin } from '../controllers/authController.js';
import { getStats } from '../controllers/registrationController.js';
import { backupDatabase } from '../controllers/backupController.js';
import { getContacts } from '../controllers/contactController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/stats', protect, getStats);
router.get('/backup', protect, backupDatabase);
router.get('/contacts', protect, getContacts);

export default router;
