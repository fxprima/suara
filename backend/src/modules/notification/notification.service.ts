import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateNotifDto, NotificationType } from "./dto/create-notification.dto";
import { NotifyDto } from "./dto/notify.dto";
import { Users } from "@prisma/client";
import { NotificationGateway } from "./notification.gateway";


@Injectable()

export class NotificationService {

    constructor(
        private prisma: PrismaService,
        private notifGateway: NotificationGateway,
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

        const full = await this.prisma.notifications.findUnique({
        where: { id: res.id },
        include: {
            actor: { select: { username: true, avatar: true, firstname: true, lastname: true } },
            gema: { select: { id: true, content: true } },
        },
        });

        if (full) {
          const item = this.mapDBToItem(full);
          this.notifGateway.emitToUser(dto.userId, 'notification:new', item);
        }

    }

    async notifyLike(actorId: string, gemaId: string) {
        
        const [gema, actor] = await Promise.all([
            
            this.prisma.gemas.findUnique({
                where: { id: gemaId },
                select: { authorId: true, content: true },
            }),
            
            this.prisma.users.findUnique({
                where: { id: actorId },
                select: { username: true },
            }),
            
        ]);

        if (!gema || !actor) return null;
        if (actorId === gema.authorId) return null;

        const existing = await this.prisma.notifications.findFirst({
            where : {
                type: NotificationType.LIKE,
                userId: gema?.authorId,
                gemaId: gemaId,
                actorId: actorId
            },
            select: {id: true}
        });

        if (existing) {
            return await this.prisma.notifications.delete({
                where: {id: existing.id}
            })
        }
        
        const createDto: CreateNotifDto = {
            type: NotificationType.LIKE,
            userId: gema?.authorId,
            gemaId: gemaId,
            actorId: actorId,
            message: `${actor?.username} liked your gema.`,
            metadata: {
                postSnippet: gema.content.slice(0, 120)
            }
        }

        return await this.create(createDto);
    }

    async notifyReply(actorId: string, gemaId: string, gemaParentId: string, snippet: {content?: string, media?: string}) {
        const { content, media } = snippet;

        const parentGema = await this.prisma.gemas.findUnique({
            where: {id: gemaParentId},
            include: {author: true}
        })

        const actor = await this.prisma.users.findUnique({
            where: {id: actorId},
            select: {username: true}
        })
        
        if (!parentGema) return null;
        if (parentGema.authorId === actorId) return null;

        const createDto: CreateNotifDto = {
            type: NotificationType.REPLY,
            userId: parentGema?.author.id,
            gemaId: gemaId,
            actorId: actorId,
            message: `${actor?.username} replied to your gema.`,
            metadata: {
                postSnippet: content?.slice(0,120),
                media: media
            }
        }

        return await this.create(createDto);
    }

    async notifyFollow(actorId: string, userId: string) {

        const existing = await this.prisma.notifications.count({
            where: {actorId: actorId, userId: userId, type: NotificationType.FOLLOW}
        })

        if (existing)
            return;

        const actor = await this.prisma.users.findUnique({
                    where: {id: actorId},
                    select: {username: true, id: true}
                })

        const createDto: CreateNotifDto = {
            type: NotificationType.FOLLOW,
            userId: userId,
            actorId: actorId,
            message: 'Follow',
            metadata: {
                subMessage: `${actor?.username} started following you.`
            }
        }

        return await this.create(createDto);
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
            createdAt: new Date(item.createdAt),
            isRead: Boolean(item.readAt),
            message: item.message,
            meta: item.metadata,
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
            orderBy: [{ readAt: 'desc' }, { createdAt: 'desc' }, { id: 'desc' }],
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

    async setUserNotificationsRead(notifications: string[], currentUserId: string) {
        return await this.prisma.notifications.updateMany({
            where: {
                id: {in: notifications},
                userId: currentUserId
            }, 
            data: {
                readAt: new Date()
            }
        })
    }

}