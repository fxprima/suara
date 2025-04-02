import { Injectable } from '@nestjs/common';
import { CreateGemaDto } from './dto/create-gema.dto';
import { UpdateGemaDto } from './dto/update-gema.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class GemaService {

  constructor(private prisma: PrismaService) {}

  async create(createGemaDto: CreateGemaDto, authorId: string) {
    return await this.prisma.gemas.create({
      data : {
        content: createGemaDto.content,
        parentId: createGemaDto.parentId,
        authorId
      }
    });
  }

  findAll() {
    return `This action returns all gema`;
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
