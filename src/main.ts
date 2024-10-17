import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
// import { LoggerMiddleware } from './logger/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // console.log('first',app)
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  // app.use(new LoggerMiddleware().use);
  await app.listen(3000);
}
bootstrap();
