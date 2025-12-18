import { Module } from '@nestjs/common';
import { GemaService } from './gema.service';
import { GemaController } from './gema.controller';
import { MediaModule } from '../media/media.module';
import { FollowService } from '../relationship/follow/follow.service';
@Module({
  imports: [MediaModule],
  controllers: [GemaController],
  providers: [GemaService, FollowService],
})
export class GemaModule {}
