import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding schedule slots...');

  // Delete existing schedules
  await prisma.booking.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.exercise.deleteMany();

  // Create workout templates
  const pushWorkout = await prisma.workout.create({
    data: {
      title: 'Titan Strength Push',
      description: 'Chest, Shoulders, Triceps',
      isPublic: true,
      exercises: {
        create: [
          { name: 'Bench Press', sets: 4, reps: 8, weight: 80 },
          { name: 'Overhead Press', sets: 3, reps: 10, weight: 60 },
          { name: 'Lateral Raises', sets: 4, reps: 15, weight: 12 },
          { name: 'Tricep Dips', sets: 3, reps: 12 },
        ],
      },
    },
  });

  const pullWorkout = await prisma.workout.create({
    data: {
      title: 'Neural Pull Protocol',
      description: 'Back, Biceps, Core',
      isPublic: true,
      exercises: {
        create: [
          { name: 'Deadlift', sets: 4, reps: 5, weight: 120 },
          { name: 'Pull Ups', sets: 4, reps: 8 },
          { name: 'Barbell Row', sets: 3, reps: 10, weight: 80 },
          { name: 'Hammer Curls', sets: 3, reps: 12, weight: 16 },
        ],
      },
    },
  });

  const hiitWorkout = await prisma.workout.create({
    data: {
      title: 'Cyber HIIT',
      description: 'Full Body High Intensity',
      isPublic: true,
      exercises: {
        create: [
          { name: 'Burpees', sets: 4, reps: 15 },
          { name: 'Box Jumps', sets: 4, reps: 10 },
          { name: 'Mountain Climbers', sets: 3, reps: 20 },
          { name: 'Kettlebell Swings', sets: 4, reps: 15, weight: 24 },
        ],
      },
    },
  });

  // Create schedule slots for today and next 3 days
  const today = new Date();
  for (let day = 0; day < 4; day++) {
    const slotDate = new Date(today);
    slotDate.setDate(today.getDate() + day);

    const timeSlots = [
      { hour: 6, minute: 0, capacity: 15 },
      { hour: 8, minute: 0, capacity: 20 },
      { hour: 10, minute: 0, capacity: 15 },
      { hour: 12, minute: 0, capacity: 10 },
      { hour: 17, minute: 0, capacity: 20 },
      { hour: 19, minute: 0, capacity: 20 },
      { hour: 21, minute: 0, capacity: 10 },
    ];

    for (const slot of timeSlots) {
      const startTime = new Date(slotDate);
      startTime.setHours(slot.hour, slot.minute, 0, 0);
      const endTime = new Date(startTime);
      endTime.setHours(startTime.getHours() + 1);

      await prisma.schedule.create({
        data: {
          startTime,
          endTime,
          capacity: slot.capacity,
        },
      });
    }
  }

  console.log('✅ Seed complete!');
  console.log(`  - 3 public workout templates`);
  console.log(`  - 28 schedule slots (4 days x 7 slots)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
