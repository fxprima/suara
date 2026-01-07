import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGemaDto } from './dto/create-gema.dto';
import { PrismaService } from 'prisma/prisma.service';
import { FollowService } from '../relationship/follow/follow.service';
import { MediaService } from '../media/media.service';
import { GEMAS_INCLUDE } from './gema.include';
import { GemaThreadService } from './thread/gema-thread.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class GemaService {
  constructor(
    private prisma: PrismaService,
    private media: MediaService,
    private follow: FollowService,
    private thread: GemaThreadService,
    private notification: NotificationService
  ) { }


  /**
   * Create a new Gema (post or reply) for a given author.
   *
   * Optionally uploads attached media files and stores their metadata
   * (url + type) into the `media` field. If `parentId` is provided, the new Gema
   * will be treated as a reply and the parent Gema's `repliesCount` will be
   * incremented by 1.
   *
   * @param createGemaDto - Payload for creating a Gema (content and optional parentId)
   * @param authorId - ID of the user creating the Gema
   * @param media - Optional list of uploaded files (images/videos) from Multer
   *
   * @returns The newly created Gema record 
   *
   * @remarks
   * - Media is uploaded in parallel using `Promise.all`.
   * - Stored media type is normalized to `'image' | 'video'` based on upload response.
   * - If `parentId` is provided but invalid, Prisma will throw on the parent update.
   */
  async create(
    createGemaDto: CreateGemaDto,
    authorId: string,
    media: Express.Multer.File[] | undefined,
  ) {
    let mediaData: { url: string; type: string }[] = [];

    // if has media uploaded files then upload the media.
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
    
      await this.notification.notifyReply(authorId, newGema.id, createGemaDto.parentId, {
        content: createGemaDto.content,
        media: mediaData.length > 0 ? mediaData[0].url : undefined
      })

      await this.prisma.gemas.update({
        where: { id: createGemaDto.parentId },
        data: { repliesCount: { increment: 1 } },
      });
    }

    return newGema;
  }


  async findOne(id: string) {
    const data = await this.thread.getGemaDetailRecursive(id);
    if (!data) throw new NotFoundException('Gema not found');
    return data;
  }


  /**
   * A service to fetch the user feed based on their followings by using Cursor pagination method.
   * 
   * 
   * @param userId 
   * @param opts 
   * @returns 
   */
  async getUserFeed(userId: string, opts: { cursor?: string, limit: number }) {
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
      where: {
        authorId: { in: userFollowingIds },
        ...cursorWhere
      },
      include: GEMAS_INCLUDE,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit + 1 // +1 to see if there are more gemas after limit
    })

    const hasNext = gemas.length > limit;
    const data = hasNext ? gemas.slice(0, limit) : gemas;
    const last = data[data.length - 1];

    // set the next cursor on last data,  cursor format: `${createdAtIso}|${id}`
    const nextCursor = last ? `${last.createdAt.toISOString()}|${last.id}` : null;

    const response = {
      data,
      nextCursor,
      hasNext
    };

    return response;
  }

  async getAuthorGemas(userId: string, opts: {
    tab: 'gemas' | 'replies' | 'media' | 'likes',
    limit: number
    cursor?: string,
  }) {
    const { tab, cursor, limit } = opts;

    let cursorWhere = {};

    if (cursor) {
      const [createdAtIso, id] = cursor.split('|');
      const createdAt = new Date(createdAtIso);

      cursorWhere = {
        OR: [
          { createdAt: { lt: createdAt } },
          { createdAt, id: { lt: id } },
        ],
      };
    }

    let tabWhere = {};

    if (tab) {
      if (tab === 'gemas') {
        tabWhere = {
          authorId: userId
        }
      }

      if (tab === 'likes') {
        tabWhere = {
          likedBy: { some: { userId } }
        }
      }

      if (tab === 'replies') {
        tabWhere = {
          AND: [
            {
              authorId: userId,
              parentId: { not: null }
            }
          ]
        }
      }

      if (tab === 'media') {
        tabWhere = {
          AND: [
            { authorId: userId },
            { NOT: { media: { equals: [] } } },
          ],
        };
      }

    }

    const gemas = await this.prisma.gemas.findMany({
      where: {
        ...tabWhere,
        ...cursorWhere,
      },
      include: GEMAS_INCLUDE,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit + 1
    })

    const hasNext = gemas.length > limit;
    const data = hasNext ? gemas.slice(0, limit) : gemas;
    const last = data[data.length - 1];

    const nextCursor = last ? `${last.createdAt.toISOString()}|${last.id}` : null;

    const response = {
      data,
      nextCursor,
      hasNext
    };

    return response;
  }

}
