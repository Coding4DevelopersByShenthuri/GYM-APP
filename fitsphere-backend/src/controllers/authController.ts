import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'fitsphere_secret_ultra_secure_2026';

export const signup = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash, name },
    });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ user: { id: user.id, email: user.email, name: user.name }, token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error during signup' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: { id: user.id, email: user.email, name: user.name }, token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error during login' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const { name, age, weight, goal, experienceLevel } = req.body;

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { 
        ...(name && { name }),
        ...(age !== undefined && { age }),
        ...(weight !== undefined && { weight }),
        ...(goal && { goal }),
        ...(experienceLevel && { experienceLevel }),
      },
    });
    res.json({ id: updated.id, email: updated.email, name: updated.name, age: updated.age, weight: updated.weight, goal: updated.goal, experienceLevel: updated.experienceLevel });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
