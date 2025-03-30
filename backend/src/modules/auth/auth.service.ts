import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import * as argon2 from 'argon2'
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { addDays } from 'date-fns';
import { UserPayload } from './interfaces/user-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
        private readonly userService: UserService,
    ) { }

    async register(registerUserDto: RegisterUserDto) {
        try {
            const { email, username, phone } = registerUserDto;

            const checks = [
                { fn: () => this.userService.findByEmail(email), errorMsg: 'Email already exists' },
                { fn: () => this.userService.findByUsername(username), errorMsg: 'Username already exists' },
                ...(phone ? [{ fn: () => this.userService.findByPhone(phone), errorMsg: 'Phone number already exists' }] : []),
            ];

            for (const check of checks) {
                const exists = await check.fn();
                if (exists) throw new HttpException(check.errorMsg, HttpStatus.BAD_REQUEST);
            }

            await this.userService.create(registerUserDto);

            return { message: 'Signup berhasil' };
        } catch (error: any) {
            throw new HttpException(
                error.message || 'Internal server error',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async login(dto: LoginDto, req: Request, res: Response) {
        const user = await this.prisma.users.findUnique({
            where: { email: dto.email },
        });

        if (!user) throw new UnauthorizedException('Invalid credentials');

        const isMatch = await argon2.verify(user.password, dto.password);

        if (!isMatch) throw new UnauthorizedException('Invalid credentials');

        const payload = {
            sub: user.id,
            username: user.username,
            email: user.email,
        }

        const accessToken = this.jwt.sign(payload);
        
        const refreshToken = {
            token: uuidv4(),
            expiredAt: addDays(new Date(), 7)
        };


        await this.prisma.refreshTokens.create({
            data: {
                userId: user.id,
                token: refreshToken.token,
                expiredAt: refreshToken.expiredAt
            }
        })


        await this.prisma.users.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        })

        return {
            accessToken: accessToken,
            refreshToken: refreshToken.token,
        }

    }

    async refresh(refreshToken: string) {
        const token = await this.prisma.refreshTokens.findUnique({
            where : { token: refreshToken },
            include: { user: true }
        })

        if (!token || new Date(token.expiredAt) < new Date()) 
            throw new UnauthorizedException('Invalid refresh token')
        
        const payload = {
            sub: token.user.id,
            username: token.user.username,
            email: token.user.email
        };

        const accessToken = this.jwt.sign(payload, {
            expiresIn: '15m'
        })

        return {
            accessToken: accessToken
        };
    }

    async logout(refreshToken: string) {
        const token = await this.prisma.refreshTokens.findUnique({
            where : { token: refreshToken }
        })

        if (!token) throw new UnauthorizedException('Invalid refresh token')

        await this.prisma.refreshTokens.delete({
            where: { id: token.id }
        })

        return {
            message: 'Logout successfully.'
        }
    }

    async me(user: UserPayload) {
        return user;
    }
}
