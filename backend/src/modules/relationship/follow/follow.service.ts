import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { UserPayload } from "../../auth/interfaces/user-payload.interface";

@Injectable()
export class FollowService {
    constructor (private prisma: PrismaService) {}


  /**
   * A service to check whether one user is following the other user or not.
   * @param userId - The user who may be following
   * @param followId - The target user being followed
   * @returns `true` if the follow relationship exists, else `false`
   */
  async isFollowingId(userId: string, followId: string): Promise<boolean> {
    const row = await this.prisma.followers.findUnique({
      where: {
        userId_followId: { userId, followId },
      },
      select: { userId: true }, 
    });

    return row !== null;
  }

  /**
   * Toggle follow relationship between the current user and a target user.
   *
   * If the current user is already following the target user,
   * this method will unfollow (delete the follower record).
   * Otherwise, it will create a new follow relationship.
   *
   * Validation rules:
   * - A user cannot follow themselves.
   * - The target user must exist.
   *
   * @param currentUser - Authenticated user performing the action
   * @param id - Target user ID to follow or unfollow
   *
   * @returns
   * - Follower record when follow is created
   * - Deleted follower reference when unfollowing
   *
   * @throws BadRequestException
   * Thrown when the user attempts to follow themselves.
   *
   * @throws NotFoundException
   * Thrown when the target user does not exist.
   */
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


  /**
   * Fetch all users that are followed by the given user (i.e., the user's followings).
   *
   * @param userId - ID of the user whose followings will be fetched
   * @returns Array of user profiles that the user follows
   *
   * @throws BadRequestException
   * Thrown when `userId` is empty or undefined.
   */
  async findFollowings(userId: string) {
    if (!userId) throw new BadRequestException('userId is required');

    const rows = await this.prisma.followers.findMany({
      where: { userId: userId },
      select: {
        follow: { 
          select: {
            id: true,
            username: true,
            firstname: true,
            lastname: true,
            avatar: true,
          },
        },
      },
    });
    const users = rows.map(r => r.follow);
    return users;
  }

  /**
   * Fetch all users that are the user's followers.
   *
   * @param userId - ID of the user whose followings will be fetched
   * @returns Array of user followers
   *
   * @throws BadRequestException
   * Thrown when `userId` is empty or undefined.
   */
  async findFollowers(userId: string) {
    if (!userId) throw new BadRequestException('userId is required');

    const rows = await this.prisma.followers.findMany({
      where: { followId: userId },
      select: {
        user: { 
          select: {
            id: true,
            username: true,
            firstname: true,
            lastname: true,
            avatar: true,
          },
        },
      },
    });
    const users = rows.map(r => r.user);
    return users;
  }

  /**
   * Get followings of a user with viewer follow status.
   *
   * Returns a paginated list of users that `userId` follows.
   * Each item includes `isFollowing` based on `currentUserId`.
   *
   * Uses cursor-based pagination with `followId`.
   *
   * Result item format:
   * {
   *   id: string;
   *   username: string;
   *   firstname: string;
   *   lastname: string;
   *   avatar: string | null;
   *   isFollowing: boolean; 
   * }
   * 
   * @param currentUserId Viewer (logged-in user)
   * @param userId Target user
   * @param opts Pagination options
   * @param opts.limit Max items (1–10)
   * @param opts.cursorFollowId Pagination cursor
   * 
   * @returns result, nextCursorFollowId 
   */
  async findFollowingsWithStatus(
    currentUserId: string,
    userId: string,
    opts?: { limit?: number; cursorFollowId?: string }
  ) {
    if (!userId) throw new BadRequestException('userId is required');
    if (!currentUserId) throw new BadRequestException('currentUserId is required');

    const take = Math.min(Math.max(opts?.limit ?? 5, 1), 10);
    const cursorFollowId = opts?.cursorFollowId;

    // take all followings of userId then paginate based on followId ascendingly
    const rows = await this.prisma.followers.findMany({
      where: { userId },
      orderBy: [{ followId: 'asc' }], 
      take: take + 1,

      // if has cursorFollowId then start to take data from that positio., otherwise skip this constraint.
      ...(cursorFollowId
        ? {
            cursor: {
              userId_followId: { userId, followId: cursorFollowId },
            },
            skip: 1, // skip the 'cursor' data as it already been shown at the previous cursor.
          }
        : {}),
      select: {
        followId: true, 
        follow: {
          select: {
            id: true,
            username: true,
            firstname: true,
            lastname: true,
            avatar: true,
          },
        },
      },
    });

    const hasNext = rows.length > take; 
    const pageRows = hasNext ? rows.slice(0, take) : rows;

    const users = pageRows.map(r => r.follow);  
    const targetIds = users.map(u => u.id);

    // take all users that is followed by currentUser from the following candidates list that will be shown.
    const followedByViewerRows =
      targetIds.length === 0
        ? []
        : await this.prisma.followers.findMany({
            where: {
              userId: currentUserId,
              followId: { in: targetIds },
            },
            select: { followId: true },
          });

    const followedByViewerSet = new Set(followedByViewerRows.map(r => r.followId));

    const data = pageRows.map(r => ({
      ...r.follow,
      isFollowing: followedByViewerSet.has(r.follow.id),
    }));

    const nextCursor= hasNext ? pageRows[pageRows.length - 1].followId : null;

    return { data, nextCursor, hasNext };
  }

  /**
   * Get users following count.
   *
   * @param userId - ID of the user whose followings will be fetched
   * @returns The numver of users that followed by user.
   *
   * @throws BadRequestException
   * Thrown when `userId` is empty or undefined.
   */
  async getFollowingCountById(userId: string) {
    return (await this.findFollowings(userId)).length;
  }

  /**
   * Get users following count.
   *
   * @param userId - ID of the user whose followers will be fetched
   * @returns The numver of users that followed user.
   *
   * @throws BadRequestException
   * Thrown when `userId` is empty or undefined.
   */
  async getFollowersCountById(userId: string) {
    return (await this.findFollowers(userId)).length;
  }


}