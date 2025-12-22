import { Controller, Get, Param, Post, Query, UnauthorizedException, UseGuards } from "@nestjs/common";
import { FollowService } from "./follow.service";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt.auth.guard";
import { CurrentUser } from "src/modules/auth/decorators/current-user.decorator";
import { UserPayload } from "src/modules/auth/interfaces/user-payload.interface";

@Controller('follow')
export class FollowController {
    constructor (private readonly followService: FollowService) {}

    @UseGuards(JwtAuthGuard)
    @Post('/:id')
    async follow(@CurrentUser() currentUser: UserPayload, @Param('id') id: string) {
        return await this.followService.follow(currentUser, id);
    }

    @Get('isfollowing/:userId/:followId')
    async isFollowingId(@Param("userId") userId: string, @Param("followId") followId: string) {
        return await this.followService.isFollowingId(userId, followId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/followings/:userId')
    async findFollowings(
        @Param("userId") userId: string,
        @Query('viewer') viewer?: string,
        @Query('cursor') cursor?: string,
        @Query('limit') limit?: string,
        @CurrentUser() currentUser?: UserPayload
    ) {
    const take = Math.min(Math.max(Number(limit) || 5, 1), 10);

    const opts = {
        limit: take,
        cursorFollowId: cursor,
    };

    if (viewer === 'me') {
        if (!currentUser) throw new UnauthorizedException();
        return this.followService.findFollowingsWithStatus(currentUser.id, userId, opts);
    }

    return this.followService.findFollowings(userId, opts);
    }

    @Get('/followers/:userId')
    async findFollowers(@Param("userId") userId: string) {
        return await this.followService.findFollowers(userId);
    } 

    @Get('/followings/:userId/count')
    async getFollowingCountById(@Param("userId") userId: string) {
        return await this.followService.getFollowingCountById(userId);
    }

    @Get('/followers/:userId/count')
    async getFollowersCountById(@Param("userId") userId: string) {
        return await this.followService.getFollowersCountById(userId);
    } 

}