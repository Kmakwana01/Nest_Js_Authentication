import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, ConflictException, Request } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegisterAuthenticationDto } from './dto/register-authentication.dto';
import { LoginAuthenticationDto } from './dto/login-authentication.dto';
import { ForgetPasswordDto } from './dto/forgetpassword.dto';
import { CompareCodeDto } from './dto/compare-code-dto';
import { ResetPasswordDto } from './dto/reset-password-dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() registerAuthenticationDto: RegisterAuthenticationDto) {
    try {
      const newUser = await this.authenticationService.register(registerAuthenticationDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'User registered successfully.',
        data: newUser,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Post('login')
  async login(
    @Request() req,
    @Body() loginAuthenticationDto: LoginAuthenticationDto
  ) {
    try {

      const userAgent = req.headers['user-agent'];

      const tokensObject = await this.authenticationService.login(loginAuthenticationDto,userAgent);

      return {
        statusCode: HttpStatus.OK,
        message: 'User logged in successfully.',
        accessToken: tokensObject?.accessToken,
        refreshToken: tokensObject?.refreshToken,
        userId: tokensObject?.user?.id,
        role: tokensObject?.user?.role,
      };
      
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Post('refreshToken')
  async refresh(@Body() refreshTokenDto: { refreshToken: string }) {
    try {

      const tokensObject = await this.authenticationService.refreshToken(refreshTokenDto.refreshToken);

      return {
        statusCode: HttpStatus.OK,
        message: 'Token refreshed successfully.',
        accessToken: tokensObject?.accessToken,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Post('forgetpassword')
  async forgetpassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    try {
      await this.authenticationService.forgetpassword(forgetPasswordDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'Verification code sent successfully',
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Post('compareCode')
  async compareCode(@Body() compareCodeDto: CompareCodeDto) {
    try {
      await this.authenticationService.comparecode(compareCodeDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'Your verification code is accepted.',
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Post('resetpassword')
  async resetpassword(@Body() resetPasswordDto: ResetPasswordDto) {
    try {
      await this.authenticationService.resetpassword(resetPasswordDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'Your password has been reset.',
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Post('logout')
  async logout(@Request() req) {
    try {
      const token: any = req.headers['authorization']?.split(' ')[1] || req.query.token;

      if (!token) {
        throw new ConflictException('A token is required for authentication');
      }

      await this.authenticationService.logout(token);

      return {
        statusCode: HttpStatus.OK,
        message: 'User logged out successfully.',
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error instanceof ConflictException) {
      return {
        statusCode: HttpStatus.CONFLICT,
        message: error.message,
        data: [],
      };
    }
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'An unexpected error occurred.',
      data: [],
    };
  }
}
