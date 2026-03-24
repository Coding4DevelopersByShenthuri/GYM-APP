import { Router } from 'express';
import { getSchedules, createBooking } from '../controllers/scheduleController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', getSchedules);
router.post('/book', authenticateToken, createBooking);

export default router;
