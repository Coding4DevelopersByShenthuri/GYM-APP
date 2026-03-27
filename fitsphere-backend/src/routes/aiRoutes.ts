import { Router } from 'express';
import { generateWorkoutPlan } from '../controllers/aiController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Endpoint to generate a personalized workout plan using AI
router.post('/generate-workout', authenticateToken, generateWorkoutPlan);

export default router;
