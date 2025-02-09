import { Transform } from 'class-transformer';
import { IsDateString, IsJWT, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateNewAccountSessionDto {
    @IsMongoId({ message: 'Account Session Service - createNewAccountSession() error: Account ID is invalid' })
    @IsString({ message: 'Account Session Service - createNewAccountSession() error: Account ID must be a string' })
    @IsNotEmpty({ message: 'Account Session Service - createNewAccountSession() error: Account ID is required' })
    accountId: string;

    @IsJWT({ message: 'Account Session Service - createNewAccountSession() error: Access token is invalid' })
    @IsString({ message: 'Account Session Service - createNewAccountSession() error: Access token must be a string' })
    @IsNotEmpty({ message: 'Account Session Service - createNewAccountSession() error: Access token is required' })
    refreshToken: string;

    @IsDateString(
        {},
        { message: 'Account Session Service - createNewAccountSession() error: Refresh token expire is invalid' },
    )
    @Transform(({ value }) => new Date(value).toISOString())
    @IsNotEmpty({ message: 'Account Session Service - createNewAccountSession() error: Refresh token is required' })
    refreshTokenExpire: Date;
}
