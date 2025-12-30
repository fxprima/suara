import { PrismaClient, NotificationType } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

type SeedNotificationsOptions = {
  /** berapa % notif yang akan dianggap sudah dibaca */
  readRatePercent?: number;
  cleanFirst?: boolean;
};


export async function seedNotifications(opts: SeedNotificationsOptions = {}) {
  const readRatePercent = opts.readRatePercent ?? 35;
  const cleanFirst = opts.cleanFirst ?? false;

  if (cleanFirst) {
    await prisma.notifications.deleteMany({});
  }

  let created = 0;
  let skipped = 0;

  // 1) FOLLOW notifications
  const followerEdges = await prisma.followers.findMany({
    select: { userId: true, followId: true },
  });

  for (const edge of followerEdges) {
    // userId = follower (actor), followId = yang di-follow (recipient)
    if (edge.userId === edge.followId) continue;

    const isRead = faker.number.int({ min: 0, max: 100 }) < readRatePercent;

    await prisma.notifications.create({
      data: {
        userId: edge.followId,
        actorId: edge.userId,
        type: NotificationType.FOLLOW,
        message: 'started following you',
        readAt: isRead ? faker.date.recent({ days: 30 }) : null,
        createdAt: faker.date.recent({ days: 60 }),
        metadata: { kind: 'follow' },
      },
    });

    created++;
  }

  // 2) LIKE notifications
  const likes = await prisma.gemaLikes.findMany({
    select: {
      userId: true,
      gemaId: true,
      createdAt: true,
      gema: { select: { authorId: true, parentId: true } },
    },
  });

  for (const like of likes) {
    if (like.gema.parentId) continue;

    const recipientId = like.gema.authorId;
    const actorId = like.userId;

    // no self-notification
    if (recipientId === actorId) {
      skipped++;
      continue;
    }

    const isRead = faker.number.int({ min: 0, max: 100 }) < readRatePercent;

    await prisma.notifications.create({
      data: {
        userId: recipientId,
        actorId,
        type: NotificationType.LIKE,
        gemaId: like.gemaId,
        message: 'liked your post',
        readAt: isRead ? faker.date.recent({ days: 30 }) : null,
        createdAt: like.createdAt,
        metadata: { kind: 'like' },
      },
    });

    created++;
  }

  // 3) REPLY notifications
  const replies = await prisma.gemas.findMany({
    where: { parentId: { not: null } },
    select: {
      id: true,
      parentId: true,
      authorId: true,
      createdAt: true,
      content: true,
      parent: { select: { authorId: true } },
    },
  });

  for (const reply of replies) {
    if (!reply.parentId || !reply.parent) continue;

    const recipientId = reply.parent.authorId;
    const actorId = reply.authorId;

    if (recipientId === actorId) {
      skipped++;
      continue;
    }

    const isRead = faker.number.int({ min: 0, max: 100 }) < readRatePercent;

    await prisma.notifications.create({
      data: {
        userId: recipientId,
        actorId,
        type: NotificationType.REPLY,
        gemaId: reply.parentId, 
        message: 'replied to your post',
        readAt: isRead ? faker.date.recent({ days: 30 }) : null,
        createdAt: reply.createdAt,
        metadata: {
          kind: 'reply',
          replyId: reply.id,
          snippet: reply.content.slice(0, 120),
        },
      },
    });

    created++;
  }

  return { created, skipped };
}

if (require.main === module) {
  seedNotifications({ readRatePercent: 35, cleanFirst: false })
    .then((res) => console.log('[seedNotifications] done:', res))
    .catch((e) => {
      console.error('[seedNotifications] error:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
