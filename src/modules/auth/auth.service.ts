import { ConflictException, Injectable } from '@nestjs/common';
import { AccountService } from '@/modules/account/account.service';
import { AuthSignupDto } from './dto/auth-signup.dto';
import { Account } from '@prisma/client';
import { BcryptHelper } from '@/shared/helpers/bcrypt.helper';
import { JwtHelper } from '@/shared/helpers/jwt.helper';
import { AuthLoginDto } from '@/modules/auth/dto/auth-login.dto';
import { LodashHelper } from '@/shared/helpers/lodash.helper';

@Injectable()
export class AuthService {
    constructor(private readonly accountService: AccountService) {}

    sanitizeAccount(account: any): any {
        if (account?.status?.name && account?.role?.name && account?.auth_provider?.name) {
            return {
                ...LodashHelper.omit(account, ['password', 'public_key', 'private_key']),
                status: account?.status?.name,
                role: account?.role?.name,
                auth_provider: account?.auth_provider?.name,
            };
        }

        return LodashHelper.omit(account, ['password', 'public_key', 'private_key']);
    }

    async signup(authSignupDto: AuthSignupDto): Promise<any> {
        const { email, password, username } = authSignupDto;
        const existingAccount: Account = await this.accountService.findAccountByEmail(email);
        if (existingAccount) {
            throw new ConflictException('Email is already in use');
        }

        const newAccount = await this.accountService.createNewAccount({
            email,
            password,
            username,
        });
        return {
            account: this.sanitizeAccount(newAccount),
        };
    }

    async login(authLoginDto: AuthLoginDto): Promise<any> {
        const { keyword, password } = authLoginDto;
        const existingAccount = await this.accountService.findAccountByLogin(keyword);
        if (!existingAccount) {
            throw new ConflictException('Account not found');
        }

        const isPasswordMatched: boolean = await BcryptHelper.compare(password, existingAccount.password);
        if (!isPasswordMatched) {
            throw new ConflictException('Password is incorrect');
        }

        const accessToken: string = JwtHelper.generateAccessToken(
            this.getAccountTokenPayload(existingAccount),
            existingAccount.private_key,
        );
        const refreshToken: string = JwtHelper.generateRefreshToken(
            { id: existingAccount?.id, invokedAt: Date.now() },
            existingAccount.private_key,
        );

        return {
            account: this.sanitizeAccount(existingAccount),
            accessToken,
            refreshToken,
        };
    }

    getAccountTokenPayload(account: any): any {
        return {
            id: account?.id,
            email: account?.email,
            username: account?.username,
            role: account?.role?.name,
            public_key: account?.public_key,
        };
    }
}
