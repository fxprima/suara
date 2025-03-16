import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    try {
      console.log("MASUK API")
      console.log('createUserDto', registerUserDto);
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
}
