import { Injectable } from '@nestjs/common';
import { CreateGemaDto } from './dto/create-gema.dto';
import { UpdateGemaDto } from './dto/update-gema.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class GemaService {

  constructor(private prisma: PrismaService) {}

  async create(createGemaDto: CreateGemaDto, authorId: string) {
    const newGema = await this.prisma.gemas.create({
      data: {
        content: createGemaDto.content,
        parentId: createGemaDto.parentId,
        authorId,
      },
    });
  
    if (createGemaDto.parentId) {
      await this.prisma.gemas.update({
        where: { id: createGemaDto.parentId },
        data: {
          repliesCount: {
            increment: 1,
          },
        },
      });
    }
  
    return newGema;
  }
  

  async findAll() {
    return await this.prisma.gemas.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      where : {
        parentId: null
      },
      include: {
        author: {
          select: {
            firstname: true,
            lastname: true,
            username: true
          }
        }
      }
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} gema`;
  }

  update(id: number, updateGemaDto: UpdateGemaDto) {
    return `This action updates a #${id} gema`;
  }

  remove(id: number) {
    return `This action removes a #${id} gema`;
  }
}
