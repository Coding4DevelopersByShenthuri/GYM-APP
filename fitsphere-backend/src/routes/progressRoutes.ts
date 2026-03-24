import { Router } from 'express';
import { logProgress, getProgressHistory } from '../controllers/progressController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, logProgress);
router.get('/', authenticateToken, getProgressHistory);

export default router;
