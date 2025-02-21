import { Injectable, NestMiddleware, HttpStatus, UnauthorizedException, ConflictException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import * as path from 'path';
import { Session } from 'src/authentication/entities/session.entity';

let secretKey: string;

try {
  secretKey = fs.readFileSync(path.resolve(__dirname, '../../jwtRS256.key'), 'utf8').trim();
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
