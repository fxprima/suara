import { Module } from "@nestjs/common";
import { FollowController } from "./follow.controller";
import { FollowService } from "./follow.service";
import { NotificationService } from "src/modules/notification/notification.service";
import { NotificationModule } from "src/modules/notification/notification.module";

@Module({
    imports: [NotificationModule],
    controllers: [FollowController],
    providers: [FollowService],
    exports: [FollowService]
})

export class FollowModule {}