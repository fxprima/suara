import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtService } from '@nestjs/jwt';
import { FollowService } from '../relationship/follow/follow.service';
import { NotificationService } from '../notification/notification.service';

@Module({
  controllers: [UserController],
  providers: [UserService, JwtService, FollowService, NotificationService],
})
export class UserModule {}
