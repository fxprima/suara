import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtService } from '@nestjs/jwt';
import { FollowService } from '../relationship/follow/follow.service';

@Module({
  controllers: [UserController],
  providers: [UserService, JwtService, FollowService],
})
export class UserModule {}
