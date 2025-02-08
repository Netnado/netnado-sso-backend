import {
    IsNotEmpty,
    IsString,
    IsStrongPassword,
    MaxLength,
    MinLength,
    Validate,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    isEmail,
} from 'class-validator';

@ValidatorConstraint({ name: 'isUsernameOrEmail', async: false })
class IsUsernameOrEmail implements ValidatorConstraintInterface {
    validate(value: string) {
        // Email validation
        if (isEmail(value)) {
            return true;
        }
        // Username validation
        return value.length >= 3 && value.length <= 100;
    }

    defaultMessage() {
        return `Auth Service - login() error: The keyword must be a valid email or username`;
    }
}

export class AuthLoginDto {
    @Validate(IsUsernameOrEmail)
    @IsString({ message: 'Auth Service - signup() error: Keyword must be a string' })
    @IsNotEmpty({ message: 'Auth Service - signup() error: Keyword is required' })
    keyword: string;

    @IsStrongPassword(
        { minLength: 6, minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1 },
        { message: 'Auth Service - signup() error: Password is not strong enough' },
    )
    @MaxLength(100, { message: 'Auth Service - signup() error: Password must be at most 100 characters long' })
    @MinLength(6, { message: 'Auth Service - signup() error: Password must be at least 6 characters long' })
    @IsNotEmpty({ message: 'Auth Service - signup() error: Password is required' })
    password: string;
}
