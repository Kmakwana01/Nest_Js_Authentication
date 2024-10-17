import { 
    IsBoolean, 
    IsEmail, 
    IsNotEmpty, 
    IsOptional, 
    IsString, 
    IsNumber, 
    Length, 
    IsEnum 
} from 'class-validator';

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
    SUPERADMIN = 'superadmin',
}

export class RegisterAuthenticationDto {
    // Require and validate email
    @IsEmail({}, { message: 'Please provide a valid email address.' })
    @IsNotEmpty({ message: 'Email is required.' }) // Ensure required first
    email: string;

    // Require and validate password after email
    @IsNotEmpty({ message: 'Password cannot be empty.' })
    @IsString({ message: 'Password must be a string.' })
    @Length(8, 20, {
        message: 'Password must be between 8 and 20 characters long.',
    })
    password: string;

    // Require and validate username after password
    @IsNotEmpty({ message: 'Username cannot be empty.' })
    @IsString({ message: 'Username must be a string.' })
    @Length(3, 30, {
        message: 'Username must be between 3 and 30 characters long.',
    })
    username: string;

    // Require and validate role after username
    @IsNotEmpty({ message: 'Role cannot be empty.' })
    @IsString({ message: 'Role must be a string.' })
    @IsEnum(UserRole, { message: 'Role must be either user, admin, or superadmin.' })
    role: UserRole;

    // Optional fields are validated after required ones
    @IsOptional()
    @IsString({ message: 'Profile image must be a string.' })
    profileImage?: string;

    @IsOptional() // Optional field
    @IsString({ message: 'Mobile number must be a string.' })
    mobileNumber?: string;

    @IsBoolean({ message: 'isDeleted must be a boolean value.' })
    @IsOptional() // Optional field with a default value
    isDeleted?: boolean = false;
}
