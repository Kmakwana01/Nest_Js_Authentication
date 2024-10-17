import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ColorModule } from './color/color.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { LoggerMiddleware } from './logger/logger.middleware';
import { AuthenticationModule } from './authentication/authentication.module';
import { AuthMiddleware } from './auth/auth.middleware';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3308,
      username: 'root',
      password: null,
      database: 'test',
      autoLoadModels: true,
      synchronize: true,
    }),
    ColorModule,
    AuthenticationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware) // Applying the middleware
      .forRoutes(
        { path: 'color', method: RequestMethod.ALL },
        { path: 'color/:id', method: RequestMethod.ALL }
      ); // Apply it only to GET /color route
  }
}

// export class AppModule { }
