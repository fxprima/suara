import { Module } from '@nestjs/common';
import { GemaService } from './gema.service';
import { GemaController } from './gema.controller';
import { MediaModule } from '../media/media.module';
import { FollowService } from '../relationship/follow/follow.service';
import { GemaEngagementController } from './engagement/gema-engagement.controller';
import { GemaEngagementService } from './engagement/gema-engagement.service';
import { GemaThreadService } from './thread/gema-thread.service';
import { NotificationService } from '../notification/notification.service';
import { FollowModule } from '../relationship/follow/follow.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [MediaModule, FollowModule, NotificationModule],
  controllers: [GemaController, GemaEngagementController],
  providers: [
    GemaService, 
    GemaEngagementService, 
    GemaThreadService,
  ] 
})
export class GemaModule {}
