import { Injectable, NestMiddleware, HttpStatus, UnauthorizedException, ConflictException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import * as path from 'path';
import { Session } from 'src/authentication/entities/session.entity';

let secretKey: string;

try {
  secretKey = fs.readFileSync(path.resolve(__dirname, '../../jwtRS256.key'), 'utf8').trim() ?? '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCISodSJygAlPSG\nZhMF7al7HIpfsVHKC2J8iEYRFWHBA6npODUatBrbGDHwhgaTAGmzSfYC9l9fxqz2\n9AQlKM8i1F7Z7V9od0WUb2dEhJ8tAMsZdY58HsbQhorKhN1/aFVn1JsSTxUTNkkn\nv11Zv20+SONsS6I30puPW9SXg2XtSe18zC7tz+cfjh7N2UCEM25F3aUi1lLXTYg9\n8FTDToVN1C67WSSxIhISIF+3geTS61sH2w4bIZPPwWqBQktZnpYORIwySUc53nJF\ne06SOmVKSKzQghMDFVpOBDhIfihLv6xTUOlWI4lWnMpNVBK62xTN5N1+1ZsRuqOK\nE4VYNN/xAgMBAAECggEABWLn/bRxSt1C27lBg7YMlm0T6pZsByo+L8dFTkwJc2gf\nvolGOgJdCa8nXBw5OsqPot0SWrQeI/91WwOHqBNN5RBpGOpIyhdlTymRoSjaT0bt\nKpoAMgIXtT/ipissQ3/eA47ou7IXQQ2KbxvLm+4qP7BVl/RWRSgEQLJuULhJ89/Y\nZ4ct52w0HUmeZEFkd8t0zFVswkqjY24Xcm1o/dKCJ1juy45/ePSx3FRbTNNNpHtC\nWuDdAZeSOvjdQqr43uBdPF3o/JqfwoRH2B489gapic30oQQ0XRPoshFjGTYcriTh\nbM5WKisilJWWtyB/2z6Lfa/oXPSI2Hjz7E4Q+OkaNQKBgQC/ZtvwBUr02XMW6Btm\n3arKVUOg68nab6luBQE7BcXdH9ubmd2E3yr3zBHOJ1bp0LVkZAVRvK+LbEqB4TB9\nWBAGAGOi14XgVyl3mM+j4/YuNwzgIfTGZ7tSKVJjvZwdgW1HpS7290jdtvctQID1\ntAJfBehrii0hU1KDXbwL3CkNHQKBgQC2Shm3GBU9HKk1dTw7/ileCmSVyGSGoX8Z\nfMriXimzQWivSMqq4uyaSra6wsVvcflTYMrmUnIEcnqEnS4kkhXDQSL5kArzIbqe\nVhzi+/2jWQfZmXmAkWhvalfJ00UF7h6+SrVI8b99a21P0cWqLVANAgn/XbFALYmi\nT1CrIOSp5QKBgQCD1cCGSc8AacrpK0S8jNB3/1TOwbpOd/0W5+GaGvbXwXrNaaT4\nQZNiDTDyc4xdDsHyfSZgz3uGqDeF0GtK2t5mk9wNLTBsfvz0ANB8zaci3A5FT34/\nLvIKvKWgR9kBRcXUxIVd3KRW+xC0Har2EmBTvUkC0bEWNEMwct70uFeaTQKBgG8U\nuJbaFhcnX/Uze4ETYCHuM10SwC9KOilN4lQPDVougZxOvzFjFsruvGsSRT2kNkqY\nsQupMdGD8STeoz+lxZ02FBn/rKx74TybPP8Uj3r6xc3TuDagZQN/yf8yvtzePd23\nqMDKj+XdkL8TFWCePCmxFGaIsXpqRXSi4IVnhfABAoGASvDumBlZHO+Vu+GobA+9\nM5lmTcs18cOp3LEjI8vqV0C1ZD2kIOqnvq6E7Erks7uaSzou8zkpeJjieHO6bzEK\nKqdIcda83vdL3eGgW+IfbA7PMeAhA25RERZAqUp2rzcLZ9tTN82vKUPmx2eSI69E\n55H0Y1oNDABbcQB8pUGMLKM=\n-----END PRIVATE KEY-----\n';
} catch (error) {
  console.error('Error reading secret key file:', error);
}
@Injectable()
export class AuthMiddleware implements NestMiddleware {

  async use(req: Request, res: Response, next: NextFunction) {

    try {

      const token: any = req.headers['authorization']?.split(' ')[1] || req.query.token;

      if (!token) {
        throw new ConflictException('A token is required for authentication');
      }

      const session: any = await Session.findOne({ where: { accessToken: token } });

      if (!session) {
        throw new UnauthorizedException('Please provide Valid Session.');
      } else if (session?.isActive == false) {
        throw new UnauthorizedException('Your session is expired.');
      }

      const isUser: any = jwt.decode(token);
      console.log('isUser', isUser)

      if (isUser?.exp) {

        const tokenExpiresAt = new Date(isUser.exp * 1000).getTime();
        const currentDate = new Date().getTime();

        console.log('tokenExpiresAt', tokenExpiresAt)
        console.log('currentDate', currentDate)

        if (tokenExpiresAt > currentDate) {
          return next(); 
        } else {
          throw new UnauthorizedException('Token expired.');
        }

      } else {
        throw new UnauthorizedException('Token is not valid.')
      }

    } catch (error) {

      if (error instanceof ConflictException || error instanceof UnauthorizedException) {
        return res.status(error.getStatus()).json({
          statusCode: error.getStatus(),
          message: error.message,
          data: [],
        });
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An unexpected error occurred.',
        data: [],
      });

    }
  }
}
