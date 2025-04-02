import { Module } from '@nestjs/common';
import { GemaService } from './gema.service';
import { GemaController } from './gema.controller';

@Module({
  controllers: [GemaController],
  providers: [GemaService],
})
export class GemaModule {}
