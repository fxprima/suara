import { Injectable, NotFoundException } from '@nestjs/common';
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

  /**
   * Mengambil balasan secara rekursif untuk ID induk tertentu, termasuk penulisnya.
   *
   * Metode ini mengambil semua balasan yang terkait dengan `id` yang diberikan dari database.
   * Untuk setiap balasan, metode ini secara rekursif mengambil balasan yang bersarang, membentuk struktur seperti pohon.
   * Array balasan yang dihasilkan mencakup properti tambahan `replies` untuk balasan yang bersarang.
   *
   * @param id - ID entitas induk yang balasannya akan diambil.
   * @returns Sebuah promise yang menghasilkan array balasan, masing-masing berisi penulisnya dan balasan yang bersarang.
   */
  async getRepliesRecursive(id: string) {
    const replies = await this.prisma.gemas.findMany({
      where: { parentId: id },
      include: { author: true }
    });
    

    for (const reply of replies) {
      reply['replies'] = await this.getRepliesRecursive(reply.id);
    }

    return replies;
  }

  async getGemaDetailRecursive(id: string) {
    const gema = await this.prisma.gemas.findUnique({
      where: { id },
      include: { author: true }
    });

    if (!gema) return null;

    const replies = await this.getRepliesRecursive(id);
    console.log({ ...gema, replies });
    return { ...gema, replies };
  }

  async findOne(id: string) {
    const data = await this.getGemaDetailRecursive(id);
    if (!data) 
      throw new NotFoundException('Gema not found');
    
    return data; 
  }

  update(id: number, updateGemaDto: UpdateGemaDto) {
    return `This action updates a #${id} gema`;
  }

  remove(id: number) {
    return `This action removes a #${id} gema`;
  }
}
