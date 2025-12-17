import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

type SeedGemaOptions = {
  maxPostsPerUser?: number;
  maxRepliesPerPost?: number;
  cleanFirst?: boolean;
};

export async function seedGemas(opts: SeedGemaOptions = {}) {
  const maxPostsPerUser = opts.maxPostsPerUser ?? 10;
  const maxRepliesPerPost = opts.maxRepliesPerPost ?? 5;
  const cleanFirst = opts.cleanFirst ?? false;

  if (cleanFirst) {
    await prisma.gemas.deleteMany({});
  }

  const users = await prisma.users.findMany({
    select: { id: true },
  });

  if (users.length === 0) {
    throw new Error('No users found. Run user seeder first.');
  }

  const rootGemas: string[] = [];
  let replyCount = 0;

  for (const user of users) {
    const postCount = faker.number.int({
      min: 0,
      max: maxPostsPerUser,
    });

    for (let i = 0; i < postCount; i++) {
      const gema = await prisma.gemas.create({
        data: {
          content: faker.lorem.paragraph(),
          authorId: user.id,
          createdAt: faker.date.recent({ days: 60 }),
          viewsCount: faker.number.int({ min: 0, max: 500 }),
        },
      });

      rootGemas.push(gema.id);
    }
  }

  for (const parentId of rootGemas) {
    const replies = faker.number.int({
      min: 0,
      max: maxRepliesPerPost,
    });

    for (let i = 0; i < replies; i++) {
      const randomUser =
        users[faker.number.int({ min: 0, max: users.length - 1 })];

      await prisma.gemas.create({
        data: {
          content: faker.lorem.sentences(
            faker.number.int({ min: 1, max: 3 })
          ),
          authorId: randomUser.id,
          parentId,
          createdAt: faker.date.recent({ days: 30 }),
        },
      });

      replyCount++;
    }

    if (replies > 0) {
      await prisma.gemas.update({
        where: { id: parentId },
        data: {
          repliesCount: {
            increment: replies,
          },
        },
      });
    }
  }

  return {
    rootPosts: rootGemas.length,
    replies: replyCount,
  };
}

if (require.main === module) {
  seedGemas({ maxPostsPerUser: 10, maxRepliesPerPost: 5, cleanFirst: false })
    .then((res) => {
      console.log('[seedGemas] done:', res);
    })
    .catch((e) => {
      console.error('[seedGemas] error:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
