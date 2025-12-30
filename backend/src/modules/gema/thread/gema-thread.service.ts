import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { GEMAS_INCLUDE } from "../gema.include";

@Injectable()
export class GemaThreadService {

    constructor(
        private prisma: PrismaService
    ) {}


    async getRepliesRecursive(id: string) {
        const replies = await this.prisma.gemas.findMany({
            where: { parentId: id },
            include: GEMAS_INCLUDE,
            orderBy: { createdAt: 'asc' },
        });

        for (const reply of replies) {
            (reply as any)['replies'] = await this.getRepliesRecursive(reply.id);
        }

        return replies;
    }

    async getGemaDetailRecursive(id: string) {
        const gema = await this.prisma.gemas.findUnique({
            where: { id },
            include: GEMAS_INCLUDE,
        });

        if (!gema) return null;

        const replies = await this.getRepliesRecursive(id);
        return { ...gema, replies };
    }


}