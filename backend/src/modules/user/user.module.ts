import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtService } from '@nestjs/jwt';
import { FollowService } from '../relationship/follow/follow.service';
import { NotificationModule } from '../notification/notification.module';


@Module({
  imports: [NotificationModule], // <-- INI WAJIB
  controllers: [UserController],
  providers: [UserService, JwtService, FollowService],
})
export class UserModule {}
