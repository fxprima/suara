import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { CreateNotifDto } from "./dto/create-notification.dto";
import { JwtAuthGuard } from "../auth/guards/jwt.auth.guard";

@Controller('notification')
export class NotificationController {

    constructor (private readonly notificationService: NotificationService) {}

    @Get(':userId')
    async getUserNotifications(
        @Param("userId") userId: string, 
        @Query("cursor") cursor?: string,
        @Query('limit') limit = 10
    ) {
        return this.notificationService.getUserNotifications(userId, {
            cursor,
            limit: Number(limit)
        })
    }
    
    @UseGuards(JwtAuthGuard)
    @Get(':userId/count')
    async getUserNotificationsCount(@Param("userId") userId: string) {
        return this.notificationService.getUserNotificationsCount(userId);
    }
}   