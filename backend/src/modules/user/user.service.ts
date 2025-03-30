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
        dob: createUserDto.dob
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


  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
