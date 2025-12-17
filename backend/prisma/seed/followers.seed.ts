import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

type SeedFollowersOptions = {
  minFollowingPerUser?: number;
  maxFollowingPerUser?: number;
  makeOnePopularUser?: boolean; 
  cleanFirst?: boolean;
};

export async function seedFollowers(opts: SeedFollowersOptions = {}) {
  const minFollowingPerUser = opts.minFollowingPerUser ?? 2;
  const maxFollowingPerUser = opts.maxFollowingPerUser ?? 10;
  const makeOnePopularUser = opts.makeOnePopularUser ?? true;
  const cleanFirst = opts.cleanFirst ?? false;

  if (cleanFirst) {
    await prisma.followers.deleteMany({});
  }

  const users = await prisma.users.findMany({
    select: { id: true, username: true },
  });

  if (users.length < 2) {
    throw new Error('Need at least 2 users to seed followers.');
  }

  let popularUserId: string | null = null;
  if (makeOnePopularUser) {
    const admin = users.find((u) => u.username === 'admin');
    popularUserId = admin?.id ?? users[0].id;
  }

  let created = 0;
  let skipped = 0;

  for (const user of users) {

    const followCount = faker.number.int({
      min: minFollowingPerUser,
      max: maxFollowingPerUser,
    });


    const candidates = users.filter((u) => u.id !== user.id);

    const targets = faker.helpers.shuffle(candidates).slice(0, followCount);

    if (popularUserId && user.id !== popularUserId) {
      const alreadyInTargets = targets.some((t) => t.id === popularUserId);
      const chance = faker.number.int({ min: 0, max: 100 }) > 40; // 60% chance
      if (!alreadyInTargets && chance) {
        targets[0] = { id: popularUserId, username: 'popular' } as any;
      }
    }

    for (const target of targets) {
      if (target.id === user.id) continue;

      const exists = await prisma.followers.findUnique({
        where: {
          userId_followId: {
            userId: user.id,
            followId: target.id,
          },
        },
      });

      if (exists) {
        skipped++;
        continue;
      }

      await prisma.followers.create({
        data: {
          userId: user.id,
          followId: target.id,
        },
      });

      created++;
    }
  }

  return { created, skipped, users: users.length };
}

if (require.main === module) {
  seedFollowers({
    minFollowingPerUser: 2,
    maxFollowingPerUser: 10,
    makeOnePopularUser: true,
    cleanFirst: false,
  })
    .then((res) => {
      console.log('[seedFollowers] done:', res);
    })
    .catch((e) => {
      console.error('[seedFollowers] error:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
