import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { CreateNotifDto } from "./dto/create-notification.dto";
import { JwtAuthGuard } from "../auth/guards/jwt.auth.guard";

@Controller('notification')
export class NotificationController {

    constructor (private readonly notificationService: NotificationService) {}

}