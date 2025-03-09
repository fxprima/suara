import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'prisma/prisma.module';
import { GemaModule } from './modules/gema/gema.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // untuk mengambil nilai dari file .env
    PrismaModule,
    GemaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
