import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class GemaService {
    constructor(private prisma: PrismaService) {}

    async getAllGemas() {
        return {
            data: await this.prisma.gema.findMany(),
            error: null,
            loading: false,
        }
    }
    sayHello() {
        return {
            data: 'Hello World!',
            error: null,
            loading: false,
        }
    }
}
