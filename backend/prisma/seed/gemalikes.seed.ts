import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

type SeedGemaLikesOptions = {
  maxLikesPerGema?: number;
  cleanFirst?: boolean;
};

export async function seedGemaLikes(opts: SeedGemaLikesOptions = {}) {
  const maxLikesPerGema = opts.maxLikesPerGema ?? 10;
  const cleanFirst = opts.cleanFirst ?? false;

  if (cleanFirst) {
    await prisma.gemaLikes.deleteMany({});
  }

  const users = await prisma.users.findMany({
    select: { id: true },
  });

  const gemas = await prisma.gemas.findMany({
    where: {
      parentId: null, // biasanya likes ke root post
    },
    select: { id: true },
  });

  if (users.length === 0 || gemas.length === 0) {
    throw new Error('Users or Gemas not found. Seed users & gemas first.');
  }

  let created = 0;
  let skipped = 0;

  for (const gema of gemas) {
    const likesCount = faker.number.int({
      min: 0,
      max: maxLikesPerGema,
    });

    const shuffledUsers = faker.helpers.shuffle(users).slice(0, likesCount);

    for (const user of shuffledUsers) {
      const exists = await prisma.gemaLikes.findUnique({
        where: {
          userId_gemaId: {
            userId: user.id,
            gemaId: gema.id,
          },
        },
      });

      if (exists) {
        skipped++;
        continue;
      }

      await prisma.gemaLikes.create({
        data: {
          userId: user.id,
          gemaId: gema.id,
          createdAt: faker.date.recent({ days: 30 }),
        },
      });

      created++;
    }
  }

  return { created, skipped };
}

if (require.main === module) {
  seedGemaLikes({ maxLikesPerGema: 10, cleanFirst: false })
    .then((res) => {
      console.log('[seedGemaLikes] done:', res);
    })
    .catch((e) => {
      console.error('[seedGemaLikes] error:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
