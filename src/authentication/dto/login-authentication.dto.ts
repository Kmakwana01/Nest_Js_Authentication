import { 
    IsEmail, 
    IsNotEmpty, 
    IsString, 
    Length, 
    IsOptional 
} from 'class-validator';

export class LoginAuthenticationDto {

    @IsEmail({}, { message: 'Please provide a valid email address.' })
    @IsNotEmpty({ message: 'Email is required.' })
    email: string;

    @IsNotEmpty({ message: 'Password cannot be empty.' })
    @IsString({ message: 'Password must be a string.' })
    @Length(8, 20, {
        message: 'Password must be between 8 and 20 characters long.',
    })
    password: string;

    // Optional notification token for push notifications
    @IsOptional()
    @IsString({ message: 'Notification token must be a string.' })
    notificationToken?: string;

    // Optional IP address of the user
    @IsOptional()
    @IsString({ message: 'IP address must be a valid string.' })
    ipAddress?: string;

    // Optional name of the device the user is logging in from
    @IsOptional()
    @IsString({ message: 'Device name must be a string.' })
    deviceName?: string;

    // Optional platform (e.g., iOS, Android)
    @IsOptional()
    @IsString({ message: 'Platform must be a string.' })
    platform?: string;

    // Optional version of the platform
    @IsOptional()
    @IsString({ message: 'Version must be a string.' })
    version?: string;
}
