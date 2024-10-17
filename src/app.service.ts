import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  OTPGenerator(): number {
    return Math.floor(900000 * Math.random() + 100000);
  }
}
