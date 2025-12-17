import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import * as argon2 from 'argon2'
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserPayload } from '../auth/interfaces/user-payload.interface';

@Injectable()
export class UserService {
  constructor (private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return await this.prisma.users.create({
      data : {
        email: createUserDto.email,
        password: await argon2.hash(createUserDto.password),
        phone: createUserDto.phone ? createUserDto.phone : null,
        username: createUserDto.username,
        firstname: createUserDto.firstname,
        lastname: createUserDto.lastname,
        dob: createUserDto.dob,
        createdAt: new Date(),
        isAdmin: false,
        isVerified: false
      }
    })
  }


  async findByEmail(email: string) {
    return await this.prisma.users.findUnique({
      where: { email },
    });
  }

  async findByUsername(username: string) {
    return await this.prisma.users.findUnique({
      where: { username },
    });
  }

  async findByPhone(phone: string) {
    return await this.prisma.users.findUnique({
      where: { phone },
    });
  }

  async getPublicProfileByUsername(username: string) {
    const res = await this.prisma.users.findUnique(
      {
        where: { username: username },
        select: {
          id: true,
          firstname: true,
          lastname: true,
          username: true,
          avatar: true,
          biography: true,
          website: true,
          location: true,
          dob: true,
          banner: true,
          createdAt: true,
        }
      }
    )
    return res;
  }


  async update(id: string, updateUserDto: UpdateUserDto) {

    if (updateUserDto.password) 
      updateUserDto.password = await argon2.hash(updateUserDto.password);
    
    return await this.prisma.users.update({
      where: { id: id },
      data: updateUserDto
    });
  }

  async isFollowingId(userId: string, followId: string): Promise<boolean> {
    const row = await this.prisma.followers.findUnique({
      where: {
        userId_followId: { userId, followId },
      },
      select: { userId: true }, 
    });

    return row !== null;
  }

  async follow(@CurrentUser() currentUser: UserPayload, id: string) {

    if (currentUser.id === id)
      throw new BadRequestException('Cannot follow yourself');

    const targetExists = await this.prisma.users.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!targetExists)
      throw new NotFoundException('User not found');

    const isFollowing = await this.isFollowingId(currentUser.id, id);
    
    if (isFollowing)
      return await this.prisma.followers.delete({
        where : {
          userId_followId : {
            userId: currentUser.id,
            followId: id
          }
        }, 
        select: {userId: true},
      })

    return await this.prisma.followers.create({
      data: {
        userId: currentUser.id,
        followId: id,
      },
    });
  }

}
