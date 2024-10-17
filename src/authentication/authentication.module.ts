import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { Token } from './token.model';
import { Session } from './session.model';
import { UserVerification } from './user_verifications';

@Module({
  imports: [SequelizeModule.forFeature([User, Token, Session, UserVerification])],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationModule { }
