import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class GemaEngagementService {
  constructor(private prisma: PrismaService) {}

  async incrementViews(gemaId: string) {
    return this.prisma.gemas.update({
      where: { id: gemaId },
      data: { viewsCount: { increment: 1 } },
    });
  }

  async likeGema(userId: string, gemaId: string) {
    const existing = await this.prisma.gemaLikes.findFirst({
      where: { userId, gemaId },
    });

    if (existing) {
      return this.prisma.gemaLikes.delete({
        where: { userId_gemaId: { userId, gemaId } },
      });
    }

    return this.prisma.gemaLikes.create({
      data: { userId, gemaId },
    });
  }
}
