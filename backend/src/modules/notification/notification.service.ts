import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateNotifDto } from "./dto/create-notification.dto";

@Injectable()

export class NotificationService {

    constructor(
        private prisma: PrismaService
    ) { }

    async create(dto: CreateNotifDto) {
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

    timeAgoShort(date: Date) {
        const now = Date.now();
        const diff = Math.max(0, now - date.getTime());

        const sec = Math.floor(diff / 1000);
        const min = Math.floor(sec / 60);
        const hr = Math.floor(min / 60);
        const day = Math.floor(hr / 24);

        if (day > 0) return `${day}d`;
        if (hr > 0) return `${hr}h`;
        if (min > 0) return `${min}m`;
        return `${sec}s`;
    }
    
    mapDBToItem(item: any) {
        return {
            id: item.id,
            type: item.type,
            actor: {
                id: item.actor.id,
                avatar: item.actor.avatar,
                username: item.actor.username
            },
            avatar: item.avatar,
            createdAtText: this.timeAgoShort(new Date(item.createdAt)),
            isRead: Boolean(item.readAt),
            message: item.message,
            meta : item.metadata,
            createdAt: item.createdAt
        }
    }

    async getUserNotifications(userId: string, opts: {
        cursor?: string,
        limit: number
    }) {
        const { cursor, limit } = opts;
        let cursorWhere = {};

        if (cursor) {
            const [createAtIso, id] = cursor.split('|');
            const createdAt = new Date(createAtIso);

            cursorWhere = {
                OR: [
                    { createdAt: { lt: createdAt } },
                    { createdAt, id: { lt: id } },
                ],
            };
        }

        const notificationsRaw = await this.prisma.notifications.findMany({
            where: {
                userId: userId,
                ...cursorWhere
            },
            include: {
                actor: {
                    select: {
                        id: true,
                        avatar: true,
                        username: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                    }
                },
                gema: {
                    select: {
                        id: true,
                        content: true
                    }
                }
            },
            orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
            take: limit + 1
        })

        const notifications = notificationsRaw.map((x) => this.mapDBToItem(x));


        const hasNext = notifications.length > limit;
        const data = hasNext ? notifications.slice(0, limit) : notifications;
        const last = data[data.length - 1];

        const nextCursor = last ? `${last.createdAt.toISOString()}|${last.id}` : null;

        const response = {
            data,
            nextCursor,
            hasNext
        };

        return response;
    }

    async getUserNotificationsCount(userId: string) {
        return this.prisma.notifications.count({
            where: {
                userId: userId,
                readAt: null
            }
        })
    }

}