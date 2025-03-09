import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class GemaService {
    constructor(private prisma: PrismaService) {}

    getAllGemas() {
        return this.prisma.gemas.findMany();
    }
}
