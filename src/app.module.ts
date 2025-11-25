import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ColorModule } from './color/color.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthenticationModule } from './authentication/authentication.module';
import { AuthMiddleware } from './auth/auth.middleware';
import { ConfigModule } from '@nestjs/config';

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      database: config.database,
      autoLoadModels: true,
      synchronize: true,
      logging: console.log, // Enable detailed logging for debugging
      dialectOptions: {
        ssl: false
      },
      retry: {
        max: 10, // Retry up to 10 times
        match: [
          /ECONNRESET/, // Retry on connection reset
          /SequelizeConnectionError/,
        ],
      },
    }),
    ColorModule,
    AuthenticationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'color', method: RequestMethod.ALL },
        { path: 'color/:id', method: RequestMethod.ALL }
      );
  }
}