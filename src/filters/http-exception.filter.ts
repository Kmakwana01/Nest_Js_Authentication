import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Response } from 'express';
  
  @Catch(HttpException)
  export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const status = exception.getStatus();
      const responseBody = exception.getResponse();
  
      let message = 'An error occurred';
      if (typeof responseBody === 'object' && 'message' in responseBody) {
        // Send only the first message
        message = Array.isArray(responseBody['message']) 
          ? responseBody['message'][0] 
          : message;
      }
  
      response.status(status).json({
        statusCode: status,
        message: message,
      });
    }
  }
  