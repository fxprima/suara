import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateNotifDto } from "./dto/create-notification.dto";

@Injectable()

export class NotificationService {

    constructor (
        private prisma: PrismaService
    ) {}

    async create (dto: CreateNotifDto) {
        const res = await this.prisma.notifications.create({
            data: {
                userId: dto.userId,
                type: dto.type,
                actorId: dto.actorId,
                gemaId: dto.gemaId,
                message: dto.message,
                metadata: dto.metadata,
            }
        });

        return res;
    }

}