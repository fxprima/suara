import { Module } from '@nestjs/common';
import { GemaService } from './gema.service';
import { GemaController } from './gema.controller';
import { MediaModule } from '../media/media.module';
import { FollowService } from '../relationship/follow/follow.service';
import { GemaEngagementController } from './engagement/gema-engagement.controller';
import { GemaEngagementService } from './engagement/gema-engagement.service';
import { GemaThreadService } from './thread/gema-thread.service';

@Module({
  imports: [MediaModule],
  controllers: [GemaController, GemaEngagementController],
  providers: [
    GemaService, 
    GemaEngagementService, 
    GemaThreadService,
    FollowService
  ] 
})
export class GemaModule {}
