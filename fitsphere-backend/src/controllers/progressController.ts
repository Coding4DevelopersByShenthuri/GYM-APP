import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/prisma';

export const logProgress = async (req: Request, res: Response) => {
  const { weight, caloriesBurned, notes } = req.body;
  const userId = (req as AuthRequest).user?.id;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const record = await prisma.progressRecord.create({
      data: {
        userId,
        weight,
        caloriesBurned,
        notes,
      },
    });
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: 'Failed to log progress' });
  }
};

export const getProgressHistory = async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).user?.id;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const history = await prisma.progressRecord.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch progress history' });
  }
};
