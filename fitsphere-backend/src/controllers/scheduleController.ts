import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/prisma';

export const getSchedules = async (req: Request, res: Response) => {
  try {
    const schedules = await prisma.schedule.findMany({
      include: {
        bookings: {
          select: { id: true }, // Just count or simple info
        },
      },
    });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
};

export const createBooking = async (req: Request, res: Response) => {
  const { scheduleId } = req.body;
  const userId = (req as AuthRequest).user?.id;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const schedule = await prisma.schedule.findUnique({
      where: { id: scheduleId },
      include: { bookings: true },
    });

    if (!schedule) return res.status(404).json({ error: 'Schedule not found' });
    if (schedule.bookings.length >= schedule.capacity) {
      return res.status(400).json({ error: 'Schedule is full' });
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        scheduleId,
      },
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
};
