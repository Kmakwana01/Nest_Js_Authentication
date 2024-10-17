import { 
    IsEmail, 
    IsNotEmpty, 
    IsString, 
    Length 
} from 'class-validator';

export class CompareCodeDto {
    @IsEmail({}, { message: 'Please provide a valid email address.' })
    @IsNotEmpty({ message: 'Email is required.' })
    email: string;

    @IsString({ message: 'Verification code must be a string.' })
    @IsNotEmpty({ message: 'Verification code is required.' })
    verificationCode: string; // New property for verification code
}
