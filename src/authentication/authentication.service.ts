import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterAuthenticationDto } from './dto/register-authentication.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/sequelize';
import { LoginAuthenticationDto } from './dto/login-authentication.dto';
import { Op } from 'sequelize';
import * as jwt from 'jsonwebtoken'
import * as fs from 'fs';
import { constants } from '../config'
import { ForgetPasswordDto } from './dto/forgetpassword.dto';
import * as nodemailer from 'nodemailer'
import { CompareCodeDto } from './dto/compare-code-dto';
import { ResetPasswordDto } from './dto/reset-password-dto';
import { User } from './entities/user.entity';
import { Token } from './entities/token.entity';
import { Session } from './entities/session.entity';
import { UserVerification } from './entities/user_verifications.entity';

let secretKey: any;
try {
  secretKey = fs.readFileSync(__dirname + "../../../jwtRS256.key", "utf8").trim() ?? '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCISodSJygAlPSG\nZhMF7al7HIpfsVHKC2J8iEYRFWHBA6npODUatBrbGDHwhgaTAGmzSfYC9l9fxqz2\n9AQlKM8i1F7Z7V9od0WUb2dEhJ8tAMsZdY58HsbQhorKhN1/aFVn1JsSTxUTNkkn\nv11Zv20+SONsS6I30puPW9SXg2XtSe18zC7tz+cfjh7N2UCEM25F3aUi1lLXTYg9\n8FTDToVN1C67WSSxIhISIF+3geTS61sH2w4bIZPPwWqBQktZnpYORIwySUc53nJF\ne06SOmVKSKzQghMDFVpOBDhIfihLv6xTUOlWI4lWnMpNVBK62xTN5N1+1ZsRuqOK\nE4VYNN/xAgMBAAECggEABWLn/bRxSt1C27lBg7YMlm0T6pZsByo+L8dFTkwJc2gf\nvolGOgJdCa8nXBw5OsqPot0SWrQeI/91WwOHqBNN5RBpGOpIyhdlTymRoSjaT0bt\nKpoAMgIXtT/ipissQ3/eA47ou7IXQQ2KbxvLm+4qP7BVl/RWRSgEQLJuULhJ89/Y\nZ4ct52w0HUmeZEFkd8t0zFVswkqjY24Xcm1o/dKCJ1juy45/ePSx3FRbTNNNpHtC\nWuDdAZeSOvjdQqr43uBdPF3o/JqfwoRH2B489gapic30oQQ0XRPoshFjGTYcriTh\nbM5WKisilJWWtyB/2z6Lfa/oXPSI2Hjz7E4Q+OkaNQKBgQC/ZtvwBUr02XMW6Btm\n3arKVUOg68nab6luBQE7BcXdH9ubmd2E3yr3zBHOJ1bp0LVkZAVRvK+LbEqB4TB9\nWBAGAGOi14XgVyl3mM+j4/YuNwzgIfTGZ7tSKVJjvZwdgW1HpS7290jdtvctQID1\ntAJfBehrii0hU1KDXbwL3CkNHQKBgQC2Shm3GBU9HKk1dTw7/ileCmSVyGSGoX8Z\nfMriXimzQWivSMqq4uyaSra6wsVvcflTYMrmUnIEcnqEnS4kkhXDQSL5kArzIbqe\nVhzi+/2jWQfZmXmAkWhvalfJ00UF7h6+SrVI8b99a21P0cWqLVANAgn/XbFALYmi\nT1CrIOSp5QKBgQCD1cCGSc8AacrpK0S8jNB3/1TOwbpOd/0W5+GaGvbXwXrNaaT4\nQZNiDTDyc4xdDsHyfSZgz3uGqDeF0GtK2t5mk9wNLTBsfvz0ANB8zaci3A5FT34/\nLvIKvKWgR9kBRcXUxIVd3KRW+xC0Har2EmBTvUkC0bEWNEMwct70uFeaTQKBgG8U\nuJbaFhcnX/Uze4ETYCHuM10SwC9KOilN4lQPDVougZxOvzFjFsruvGsSRT2kNkqY\nsQupMdGD8STeoz+lxZ02FBn/rKx74TybPP8Uj3r6xc3TuDagZQN/yf8yvtzePd23\nqMDKj+XdkL8TFWCePCmxFGaIsXpqRXSi4IVnhfABAoGASvDumBlZHO+Vu+GobA+9\nM5lmTcs18cOp3LEjI8vqV0C1ZD2kIOqnvq6E7Erks7uaSzou8zkpeJjieHO6bzEK\nKqdIcda83vdL3eGgW+IfbA7PMeAhA25RERZAqUp2rzcLZ9tTN82vKUPmx2eSI69E\n55H0Y1oNDABbcQB8pUGMLKM=\n-----END PRIVATE KEY-----\n';
} catch (error) {
  console.error('Error reading secret key file:', error);
}

const options: jwt.SignOptions = {
  expiresIn: constants.ACCESS_TOKEN_EXPIRE_IN_DAY,
  algorithm: 'RS256'
};

@Injectable()
export class AuthenticationService {

  constructor(

    @InjectModel(User)
    private UserModel: typeof User,  // Inject the User model

    @InjectModel(Token)
    private TokenModel: typeof Token,

    @InjectModel(Session)
    private SessionModel: typeof Session,

    @InjectModel(UserVerification)
    private UserVerificationModel: typeof UserVerification
  ) { }

  async findByEmail(email: string) {
    return await this.UserModel.findOne({ where: { email } })
  }

  async register(RegisterAuthenticationDto: RegisterAuthenticationDto) {

    const { email, mobileNumber, password, profileImage, role , username  } = RegisterAuthenticationDto;

    let hashPassword: string | undefined;

    if (password) {
      hashPassword = await bcrypt.hash(password, 7);
    } else {
      console.warn('Password not provided or is empty');
    }

    let findUser = await this.findByEmail(email);
    console.log('Checking if user exists with email:', email);

    if (findUser) {
      throw new ConflictException('Email already exists.');
    }

    return await this.UserModel.create({
      email,
      username,
      password: hashPassword || '', // Use an empty string if hashPassword is undefined
      role,
      isDeleted: false,
      mobileNumber,
      profileImage,
    });
  }

  async login(LoginAuthenticationDto: LoginAuthenticationDto, userAgent: any) {

    const { email, password, notificationToken, ipAddress, deviceName, platform, version } = LoginAuthenticationDto;

    const User = await this.UserModel.findOne({
      where: {
        [Op.or]: [
          // { username: email },
          { email: email }
        ],
        isDeleted: false
      }
    });

    if (!User) {
      throw new ConflictException('Invalid Credentials.');
    }

    const passwordMatch = await bcrypt.compare(password, User?.password);

    if (!passwordMatch) {
      throw new ConflictException('Password invalid');
    }

    const objectToCreateToken: any = {
      userId: User?.id,
      username: User?.username,
      email: User?.email,
      role: User?.role,
    };

    try {

      const accessToken = await this.generateToken(objectToCreateToken, options);

      const refreshToken = jwt.sign({ userId: User.id }, secretKey, {
        expiresIn: constants.REFRESH_TOKEN_EXPIRE_IN_DAY,
        algorithm: 'RS256',
      });

      await this.TokenModel.create({
        userId: User.id,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });

      await this.SessionModel.create({
        userId: User.id,
        notificationToken: notificationToken || null,
        accessToken: accessToken,
        userAgent: userAgent || '', // Use request object if you have access (e.g., req.headers['user-agent'])
        ipAddress: ipAddress || '', // Use request object if available (e.g., req.ip)
        deviceName: deviceName || null,
        platform: platform || null,
        version: version || null,
        isActive: true,
      });

      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: User
      };

    } catch (error) {
      console.error('Error generating tokens:', error);
      throw new ConflictException('Could not generate tokens. Please try again later.');
    }
  }

  async forgetpassword(ForgetPasswordDto: ForgetPasswordDto) {

    const User: any = await this.findByEmail(ForgetPasswordDto?.email);

    if (!User) {
      throw new ConflictException('please provide valid email.');
    }

    await this.UserVerificationModel.destroy({ where: { email: User.email } });

    let otp = this.OTPGenerator();

    await this.UserVerificationModel.create({
      verificationCode: otp,
      email: User?.email
    })

    await this.sendMail(User?.email, `Forget Password `, `OTP : ${otp}`).catch(err => console.log(err));

    return;
  }

  async comparecode(CompareCodeDto: CompareCodeDto) {

    const User: any = await this.findByEmail(CompareCodeDto?.email);

    if (!User) {
      throw new ConflictException('please provide valid email.');
    }

    const reset = await this.UserVerificationModel.findOne({ where: { email: User.email, verificationCode: CompareCodeDto?.verificationCode, } });

    if (!reset) {
      throw new ConflictException("Invalid verification code.");
    }

    return;
  }

  async resetpassword(ResetPasswordDto: ResetPasswordDto) {

    const { email, confirmPassword, password } = ResetPasswordDto;

    if (password !== confirmPassword) {
      throw new ConflictException("Password is not matched with confirmation password.");
    }

    const User: any = await this.findByEmail(email);

    if (!User) {
      throw new ConflictException('please provide valid email.');
    }

    const reset = await this.UserVerificationModel.findOne({ where: { email: User.email, verificationCode: ResetPasswordDto?.verificationCode, } });

    if (!reset) {
      throw new ConflictException("Invalid verification code.");
    }

    const oldAndNewPasswordIsSame = await bcrypt.compare(password, User?.password)

    if (oldAndNewPasswordIsSame) {
      throw new ConflictException('New Password Matches Old Password. Please choose a different password for security purposes.')
    }

    User.password = await bcrypt.hash(password, 10);
    await User.save();

    return;
  }

  async logout(token: string) {

    const findSession = await this.SessionModel.findOne({ where: { accessToken: token, isActive: true } })

    if (!findSession) {
      throw new ConflictException('please provide valid token.');
    }

    findSession.isActive = false;
    await findSession.save();

    return;
  }

  async refreshToken(refreshToken: string) {

    const decoded = jwt.decode(refreshToken, { complete: true }) as any;

    if (decoded.payload && decoded.payload.exp) {

      const currentTime = Math.floor(Date.now() / 1000); // Get current time in Unix format

      if (decoded.payload.exp < currentTime) {
        throw new ConflictException('Refresh token has expired.');
      }

    } else {
      throw new ConflictException('Invalid refresh token payload.');
    }

    const tokenData = await this.TokenModel.findOne({ where: { refreshToken } });
    const sessionData = await this.SessionModel.findOne({ where: { accessToken: tokenData?.accessToken } });

    if (!tokenData || !sessionData) {
      throw new ConflictException('Invalid refresh token.');
    }

    const user = await this.UserModel.findByPk(decoded.payload.userId);
    if (!user) {
      throw new ConflictException('User not found.');
    }

    const objectToCreateToken = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const newAccessToken = await this.generateToken(objectToCreateToken, options);

    tokenData.accessToken = newAccessToken;
    await tokenData.save();

    sessionData.accessToken = newAccessToken;
    await sessionData.save();

    return { accessToken: newAccessToken };
  }


  async generateToken(objectToCreateToken: any, options: any) {
    return await jwt.sign(objectToCreateToken, secretKey, options);
  }

  OTPGenerator(): number {
    return Math.floor(900000 * Math.random() + 100000);
  }

  async sendMail(to: any, subject: any, text: any, html?: any) {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: "khushalmakwana786@gmail.com",
          pass: 'mdkokejuebbwskqt',
        },
      });

      let info = await transporter.sendMail({
        from: 'khushalmakwana786@gmail.com',
        to,
        subject,
        text: text,
        html: html
      });

      console.log('Message sent: %s', info.messageId);
      return true;
    } catch (error) {
      console.error('Error occurred while sending email:', error);
      return false; // Failed to send email
    }
  }
}
