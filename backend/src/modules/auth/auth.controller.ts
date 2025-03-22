import { Body, Controller, HttpException, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    try {
      const { email, username, phone } = registerUserDto;

      const checks = [
        { fn: () => this.usersService.findByEmail(email), errorMsg: 'Email already exists' },
        { fn: () => this.usersService.findByUsername(username), errorMsg: 'Username already exists' },
        ...(phone ? [{ fn: () => this.usersService.findByPhone(phone), errorMsg: 'Phone number already exists' }] : []),
      ];

      for (const check of checks) {
        const exists = await check.fn();
        if (exists) throw new HttpException(check.errorMsg, HttpStatus.BAD_REQUEST);
      }

      await this.usersService.create(registerUserDto);

      return { message: 'Signup berhasil' };
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Internal server error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('signin')
  async login (@Body() loginDto: LoginDto, @Req() req: Request, @Res() res: Response) {
    return this.usersService.login(loginDto, req, res);
  }

  @Post('refresh') 
  refresh(@Req() req: Request, @Res() res: Response) {
    return this.usersService.refresh(req, res);
  }

  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    this.usersService.logout(req, res);
  }
}
