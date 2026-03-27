import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './config/prisma';
import authRoutes from './routes/authRoutes';
import workoutRoutes from './routes/workoutRoutes';
import progressRoutes from './routes/progressRoutes';
import scheduleRoutes from './routes/scheduleRoutes';
import aiRoutes from './routes/aiRoutes';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log('Client connected via socket:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.set('io', io); // make io available in controllers

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/schedule', scheduleRoutes); // Alias to fix mobile client 404
app.use('/api/ai', aiRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'FitSphere AI Backend is running', timestamp: new Date() });
});

server.listen(PORT, () => {
  console.log(`🚀 FitSphere AI Backend running on port ${PORT}`);
});

export default server;
