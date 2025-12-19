import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGemaDto } from './dto/create-gema.dto';
import { UpdateGemaDto } from './dto/update-gema.dto';
import { PrismaService } from 'prisma/prisma.service';
import { MediaService } from '../media/media.service';
import { FollowService } from '../relationship/follow/follow.service';

@Injectable()
export class GemaService {
  constructor(
    private prisma: PrismaService, 
    private media: MediaService, 
    private follow: FollowService
  ) {}

  private static readonly GEMAS_INCLUDE = {
    author: {
      select: {
        id: true,
        firstname: true,
        lastname: true,
        username: true,
        avatar: true,
      },
    },
    likedBy: {
      select: {
        user: {
          select: {
            id: true,
            avatar: true,
            firstname: true,
            lastname: true,
            username: true,
          },
        },
      },
    },
  } as const;


  async create(
    createGemaDto: CreateGemaDto,
    authorId: string,
    media: Express.Multer.File[] | undefined,
  ) {
    let mediaData: { url: string; type: string }[] = [];

    if (media && media.length > 0) {
      const uploaded = await Promise.all(media.map((file) => this.media.upload(file)));

      mediaData = uploaded.map((res) => ({
        url: res.url,
        type: res.resource_type === 'image' ? 'image' : 'video',
      }));
    }

    const newGema = await this.prisma.gemas.create({
      data: {
        content: createGemaDto.content,
        parentId: createGemaDto.parentId,
        authorId,
        media: mediaData.length > 0 ? mediaData : undefined,
      },
    });

    if (createGemaDto.parentId) {
      await this.prisma.gemas.update({
        where: { id: createGemaDto.parentId },
        data: { repliesCount: { increment: 1 } },
      });
    }

    return newGema;
  }

  async findLikedGemasByUser(userId: string) {
    return await this.prisma.gemas.findMany({
      where: { likedBy: { some: { userId } } },
      include: GemaService.GEMAS_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findGemasByAuthor(authorId: string) {
    return await this.prisma.gemas.findMany({
      where: { authorId },
      include: GemaService.GEMAS_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll() {
    return await this.prisma.gemas.findMany({
      where: { parentId: null },
      include: GemaService.GEMAS_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRepliesRecursive(id: string) {
    const replies = await this.prisma.gemas.findMany({
      where: { parentId: id },
      include: GemaService.GEMAS_INCLUDE,
      orderBy: { createdAt: 'asc' },
    });

    for (const reply of replies) {
      (reply as any)['replies'] = await this.getRepliesRecursive(reply.id);
    }

    return replies;
  }

  async getGemaDetailRecursive(id: string) {
    const gema = await this.prisma.gemas.findUnique({
      where: { id },
      include: GemaService.GEMAS_INCLUDE,
    });

    if (!gema) return null;

    const replies = await this.getRepliesRecursive(id);
    return { ...gema, replies };
  }

  async incrementViews(id: string) {
    return this.prisma.gemas.update({
      where: { id },
      data: { viewsCount: { increment: 1 } },
    });
  }

  async likeGema(uid: string, gid: string) {
    const isGemaLiked = await this.prisma.gemaLikes.findFirst({
      where: { userId: uid, gemaId: gid },
    });

    if (isGemaLiked) {
      return this.prisma.gemaLikes.delete({
        where: { userId_gemaId: { userId: uid, gemaId: gid } },
      });
    }

    return this.prisma.gemaLikes.create({
      data: { gemaId: gid, userId: uid },
    });
  }

  async findOne(id: string) {
    const data = await this.getGemaDetailRecursive(id);
    if (!data) throw new NotFoundException('Gema not found');
    return data;
  }


  // Cursor Pagination
  async getUserFeed(userId: string, opts: {cursor?: string, limit: number}) {
    const { cursor, limit } = opts;

    // Get users followings
    let userFollowingIds = (await this.follow.findFollowings(userId)).map(u => u.id);

    userFollowingIds = [...userFollowingIds, userId];

    let cursorWhere = {};
    if (cursor) {
      const [createdAtIso, id] = cursor.split('|');
      const createdAt = new Date(createdAtIso);

      // Get all posts where in interval date -> createAt gemas 
      cursorWhere = {
        OR: [
          { createdAt: { lt: createdAt } },
          { createdAt, id: { lt: id } },
        ],
      };
    }

    // Query based on cursor if cursor exists -> include cursor constraint else dont include
    const gemas = await this.prisma.gemas.findMany({
      where : {
        authorId: {in: userFollowingIds},
        ...cursorWhere
      },
      include: GemaService.GEMAS_INCLUDE,
      orderBy: [{ createdAt: 'desc' }, {id: 'desc'}],
      take: limit + 1 // +1 to see if there are more gemas after limit
    })

    const hasMore = gemas.length > limit;
    const data = hasMore? gemas.slice(0, limit) : gemas;
    const last = data[data.length - 1];

    // set the next cursor on last data,  cursor format: `${createdAtIso}|${id}`
    const nextCursor = last ? `${last.createdAt.toISOString()}|${last.id}` : null;
    
    const response = {
      data,
      nextCursor,
      hasMore
    };

    return response;
  }

}
