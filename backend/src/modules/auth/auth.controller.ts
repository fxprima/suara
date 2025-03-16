import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      
      const existingUserByEmail = await this.usersService.findByEmail(createUserDto.email);
      if (existingUserByEmail) {
        throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
      }

      const existingUserByUsername = await this.usersService.findByUsername(createUserDto.username);
      if (existingUserByUsername) {
        throw new HttpException('Username already exists', HttpStatus.BAD_REQUEST);
      }

      if (createUserDto.phone) {
        const existingUserByPhone = await this.usersService.findByPhone(createUserDto.phone);
        if (existingUserByPhone) {
          throw new HttpException('Phone number already exists', HttpStatus.BAD_REQUEST);
        }
      }

      await this.usersService.create(createUserDto);

      return {
        message: 'Signup berhasil',
      };
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Internal server error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
