import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import * as argon2 from 'argon2'

@Injectable()
export class UserService {
  constructor (private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    return this.prisma.users.create({
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

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {

    if (updateUserDto.password) {
      updateUserDto.password = await argon2.hash(updateUserDto.password);
    }
    return await this.prisma.users.update({
      where: { id: id },
      data: updateUserDto
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
