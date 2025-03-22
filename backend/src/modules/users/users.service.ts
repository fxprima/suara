import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import * as argon2 from 'argon2'
import { LoginDto } from '../auth/dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';

@Injectable()
export class UsersService {
  constructor (private prisma: PrismaService, private jwt: JwtService) {}
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
  
  async logout(req: Request, res: Response) {
    const token = req.cookies['refresh_token'];

    if(token) {
      await this.prisma.refreshTokens.delete({
        where: { token }
      });
      res.clearCookie('refresh_token');
    }

    return res.json({ message: 'Anda telah logout.' })
  }

  async refresh(req: Request, res: Response) {
    const token = req.cookies['refresh_token'];
    if (!token) throw new UnauthorizedException('No token provided');

    const storedToken = await this.prisma.refreshTokens.findUnique({
      where: { token }
    });

    if(!storedToken || storedToken.expiresAt < new Date()) 
      throw new UnauthorizedException('Token has expired');

    const accessToken = this.jwt.sign(
      { sub: storedToken.userId }, 
      { expiresIn: '15m' }
    )

    return res.json({ accessToken })
  }

  async login(dto: LoginDto, req: Request, res: Response) {
    const user = await this.prisma.users.findUnique({
      where: { email: dto.email },
    });

    console.log(
      'login servce',
      dto.email,
      dto.password,
      user
    )

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await argon2.verify(user.password, dto.password);

    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const accessToken = this.jwt.sign(
      { sub: user.id }, 
      { expiresIn: '15m' }
    );

    const refreshToken = uuidv4();

    // set last login
    await this.prisma.users.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    })

    await this.prisma.refreshTokens.create({
      data : {
        token: refreshToken,
        userId: user.id,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
      }
    })


    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 30
    })

    

    return res.json({
      data: {
        "accessToken": accessToken,
        "user": user,
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
