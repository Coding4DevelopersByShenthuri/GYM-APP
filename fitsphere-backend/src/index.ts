import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './config/prisma';
import authRoutes from './routes/authRoutes';
import workoutRoutes from './routes/workoutRoutes';
import progressRoutes from './routes/progressRoutes';
import scheduleRoutes from './routes/scheduleRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/schedule', scheduleRoutes); // Alias to fix mobile client 404

app.get('/health', (req, res) => {
  res.json({ status: 'FitSphere AI Backend is running', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`🚀 FitSphere AI Backend running on port ${PORT}`);
});

export default app;
