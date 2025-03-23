import { Body, Controller, HttpException, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
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

  @Post('signin')
  async login (@Body() loginDto: LoginDto, @Req() req: Request, @Res() res: Response) {
    return this.userService.login(loginDto, req, res);
  }

}
