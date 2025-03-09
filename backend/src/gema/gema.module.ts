import { Module } from '@nestjs/common';
import { GemaService } from './gema.service';
import { GemaController } from './gema.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GemaController],
  providers: [GemaService],
})
export class GemaModule {}
