import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class GemaService {
    constructor(private prisma: PrismaService) {}

    async getAllGemas() {
        return {
            data: await this.prisma.gemas.findMany(),
            error: null,
            loading: false,
        }
    }
    sayHello() {
        console.log("Hello World!")
        return {
            data: 'Hello World!',
            error: null,
            loading: false,
        }
    }
}
