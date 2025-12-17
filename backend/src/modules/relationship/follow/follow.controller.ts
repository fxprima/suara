import { Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
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

    @Get('/followings/:userId')
    async findFollowings(@Param("userId") userId: string) {
        return await this.followService.findFollowings(userId);
    }

    @Get('/followers/:userId')
    async findFollowers(@Param("userId") userId: string) {
        return await this.followService.findFollowers(userId);
    } 

    @Get('/followings/:userId/count')
    async getFollowingCountById(@Param("userId") userId: string) {
        return await this.followService.getFollowingCountById(userId);
    }

    @Get('/followers/:userId')
    async getFollowersCountById(@Param("userId") userId: string) {
        return await this.getFollowersCountById(userId);
    } 

}