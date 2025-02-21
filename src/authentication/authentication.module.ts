import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { Token } from './entities/token.entity';
import { Session } from './entities/session.entity';
import { UserVerification } from './entities/user_verifications.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Token, Session, UserVerification])],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationModule { }
