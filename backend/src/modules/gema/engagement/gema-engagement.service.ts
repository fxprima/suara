import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateNotifDto, NotificationType } from 'src/modules/notification/dto/create-notification.dto';
import { NotifyDto } from 'src/modules/notification/dto/notify.dto';
import { NotificationService } from 'src/modules/notification/notification.service';

@Injectable()
export class GemaEngagementService {
  constructor(
    private prisma: PrismaService,
    private notification: NotificationService
  ) {}

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

    await this.notification.notifyLike(userId, gemaId);

    return this.prisma.gemaLikes.create({
      data: { userId, gemaId },
    });
  }
}
