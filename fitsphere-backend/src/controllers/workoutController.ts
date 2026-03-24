import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/prisma';

export const createWorkout = async (req: Request, res: Response) => {
  const { title, description, exercises } = req.body;
  const userId = (req as AuthRequest).user?.id;

  try {
    const workout = await prisma.workout.create({
      data: {
        title,
        description,
        userId,
        exercises: {
          create: exercises, // Expecting array of { name, sets, reps, weight, duration }
        },
      },
      include: { exercises: true },
    });
    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create workout' });
  }
};

export const getWorkouts = async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).user?.id;

  try {
    const workouts = await prisma.workout.findMany({
      where: {
        OR: [{ userId }, { isPublic: true }],
      },
      include: { exercises: true },
    });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
};
