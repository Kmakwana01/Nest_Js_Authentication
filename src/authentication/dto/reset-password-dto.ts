import { 
    IsEmail, 
    IsNotEmpty, 
    IsString, 
    Length, 
    ValidateNested 
} from 'class-validator';

export class ResetPasswordDto {
    @IsEmail({}, { message: 'Please provide a valid email address.' })
    @IsNotEmpty({ message: 'Email is required.' })
    email: string;

    @IsString({ message: 'Password must be a string.' })
    @IsNotEmpty({ message: 'Password is required.' })
    @Length(8, 20, { message: 'Password must be between 6 and 20 characters.' })
    password: string;

    @IsString({ message: 'Confirmation password must be a string.' })
    @IsNotEmpty({ message: 'Confirmation password is required.' })
    @Length(8, 20, { message: 'Confirmation password must be between 6 and 20 characters.' })
    confirmPassword: string;
}
