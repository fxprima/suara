import { PrismaClient } from '@prisma/client';

import { seedSuperUser, seedUsers } from './users.seed';
import { seedFollowers } from './followers.seed';
import { seedGemas } from './gemas.seed';
import { seedGemaLikes } from './gemalikes.seed';

const prisma = new PrismaClient();

async function clearDatabase() {
  await prisma.$transaction([
    prisma.gemaLikes.deleteMany({}),
    prisma.followers.deleteMany({}),
    prisma.refreshTokens.deleteMany({}),
    prisma.gemas.deleteMany({}),
    prisma.users.deleteMany({}),
  ]);
}

async function main() {
  console.log('[reset] clearing database...');
  await clearDatabase();

  console.log('[reset] seeding super user...');
  await seedSuperUser();

  console.log('[reset] seeding users...');
  await seedUsers({ count: 50, password: 'password123', cleanFirst: false });

  console.log('[reset] seeding followers...');
  await seedFollowers({
    minFollowingPerUser: 2,
    maxFollowingPerUser: 10,
    makeOnePopularUser: true,
    cleanFirst: false,
  });

  console.log('[reset] seeding gemas...');
  await seedGemas({
    maxPostsPerUser: 10,
    maxRepliesPerPost: 5,
    cleanFirst: false,
  });

  console.log('[reset] seeding gemalikes...');
  await seedGemaLikes({
    maxLikesPerGema: 10,
    cleanFirst: false,
  });

  console.log('[reset] DONE ✅');
}

if (require.main === module) {
  main()
    .catch((e) => {
      console.error('[reset] error:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
