import { IsEmail, IsNotEmpty, IsStrongPassword, MaxLength, MinLength } from 'class-validator';

export class AuthSignupDto {
    @IsEmail({}, { message: 'Auth Service - signup() error: Invalid email address' })
    @IsNotEmpty({ message: 'Auth Service - signup() error: Email is required' })
    email: string;

    @MaxLength(100, { message: 'Auth Service - signup() error: Username must be at most 100 characters long' })
    @MinLength(3, { message: 'Auth Service - signup() error: Username must be at least 3 characters long' })
    @IsNotEmpty({ message: 'Auth Service - signup() error: Username is required' })
    username: string;

    @IsStrongPassword(
        { minLength: 6, minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1 },
        { message: 'Auth Service - signup() error: Password is not strong enough' },
    )
    @MaxLength(100, { message: 'Auth Service - signup() error: Password must be at most 100 characters long' })
    @MinLength(6, { message: 'Auth Service - signup() error: Password must be at least 6 characters long' })
    @IsNotEmpty({ message: 'Auth Service - signup() error: Password is required' })
    password: string;
}
