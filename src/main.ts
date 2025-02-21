import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import * as dotenv from 'dotenv';

// import { LoggerMiddleware } from './logger/logger.middleware';

async function bootstrap() {
  dotenv.config();
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  // console.log('first',app)
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  // app.use(new LoggerMiddleware().use);
  await app.listen(port, '0.0.0.0');
}
bootstrap();
