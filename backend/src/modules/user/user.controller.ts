import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from './interfaces/user.interface';
import { UserPayload } from '../auth/interfaces/user-payload.interface';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('profile/:username')
  async getPublicProfile(@Param('username') username: string) {
    return await this.userService.getPublicProfileByUsername(username);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/follow/:id')
  async follow(@CurrentUser() currentUser: UserPayload, @Param('id') id: string) {
    return await this.userService.follow(currentUser, id);
  }

  @Get('/isfollowing/:userId/:followId')
  async isFollowingId(@Param("userId") userId: string, @Param("followId") followId: string) {
    return await this.userService.isFollowingId(userId, followId);
  }
}
