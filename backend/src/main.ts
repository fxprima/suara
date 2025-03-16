import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true, // menolak data yang tidak didefinisikan dalam DTO
    transform: true, // mengubah tipe data yang dikirimkan sesuai dengan DTO
  }));

  app.use(cookieParser());
  

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
