import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'prisma/prisma.module';
import { GemaModule } from './modules/gema/gema.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    GemaModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
