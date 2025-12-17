import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { UserPayload } from "../../auth/interfaces/user-payload.interface";

@Injectable()
export class FollowService {
    constructor (private prisma: PrismaService) {}

  async isFollowingId(userId: string, followId: string): Promise<boolean> {
    const row = await this.prisma.followers.findUnique({
      where: {
        userId_followId: { userId, followId },
      },
      select: { userId: true }, 
    });

    return row !== null;
  }

  async follow(@CurrentUser() currentUser: UserPayload, id: string) {

    if (currentUser.id === id)
      throw new BadRequestException('Cannot follow yourself');

    const targetExists = await this.prisma.users.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!targetExists)
      throw new NotFoundException('User not found');

    const isFollowing = await this.isFollowingId(currentUser.id, id);
    
    if (isFollowing)
      return await this.prisma.followers.delete({
        where : {
          userId_followId : {
            userId: currentUser.id,
            followId: id
          }
        }, 
        select: {userId: true},
      })

    return await this.prisma.followers.create({
      data: {
        userId: currentUser.id,
        followId: id,
      },
    });
  }

  async findFollowings(userId: string) {
    return this.prisma.followers.findMany({
      where: {
        userId: userId
      }
    })
  }

  async findFollowers(userId: string) {
    return this.prisma.followers.findMany({
      where: {
        followId: userId
      }
    })
  }

}