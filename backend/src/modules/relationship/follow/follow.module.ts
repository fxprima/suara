import { Module } from "@nestjs/common";
import { FollowController } from "./follow.controller";
import { FollowService } from "./follow.service";
import { NotificationService } from "src/modules/notification/notification.service";

@Module({
    controllers: [FollowController],
    providers: [FollowService, NotificationService]
})

export class FollowModule {}