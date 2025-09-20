import { Module } from '@nestjs/common';
import { GemaService } from './gema.service';
import { GemaController } from './gema.controller';
import { MediaModule } from '../media/media.module';
@Module({
  imports: [MediaModule],
  controllers: [GemaController],
  providers: [GemaService],
})
export class GemaModule {}
