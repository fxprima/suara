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
        },
        likedBy: {
          select : {
            user: {
              select : {
                firstname: true,
                lastname: true,
                username: true
              }
            }
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
      include: { 
        author: true, 
        likedBy: {
          select : {
            user : {
              select : {
                id: true,
                username: true,
              }
            }
          }
        }}
    });
    

    for (const reply of replies) {
      reply['replies'] = await this.getRepliesRecursive(reply.id);
    }

    return replies;
  }

  async getGemaDetailRecursive(id: string) {
    const gema = await this.prisma.gemas.findUnique({
      where: { id },
      include: { 
        author: true , 
        likedBy: {
          select : {
            user : {
              select : {
                id: true,
                username: true,
              }
            }
          }
        }
      }
    });

    if (!gema) return null;

    const replies = await this.getRepliesRecursive(id);
    if (process.env.NODE_ENV !== 'production') {
      // console.log({ ...gema, replies });
    }
    return { ...gema, replies };
  }

  async incrementViews(id: string) {
    return this.prisma.gemas.update({
      where: { id },
      data: {
        viewsCount: { increment: 1 },
      },
    });
  }

  async likeGema(uid: string, gid: string) {
    
    const isGemaLiked = await this.prisma.gemaLikes.findFirst({
      where: { userId: uid, gemaId: gid }
    })

    if (isGemaLiked) 
        return this.prisma.gemaLikes.delete({
          where : {userId_gemaId: {
            userId: uid,
            gemaId: gid
          }}
        })

    return this.prisma.gemaLikes.create({
      data : {
        gemaId: gid,
        userId: uid
      }
    })
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
