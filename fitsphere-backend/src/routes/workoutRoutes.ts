import { Router, Request, Response } from 'express';
import { createWorkout, getWorkouts } from '../controllers/workoutController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, createWorkout);
router.get('/', authenticateToken, getWorkouts);

export default router;
