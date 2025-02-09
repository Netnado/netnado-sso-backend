import { ConflictException, Injectable } from '@nestjs/common';
import { AccountService } from '@/modules/account/account.service';
import { AuthSignupDto } from './dto/auth-signup.dto';
import { Account } from '@prisma/client';
import { BcryptHelper } from '@/shared/helpers/bcrypt.helper';
import { JwtHelper } from '@/shared/helpers/jwt.helper';
import { AuthLoginDto } from '@/modules/auth/dto/auth-login.dto';
import { LodashHelper } from '@/shared/helpers/lodash.helper';
import { AccountSessionService } from '@/modules/account-session/account-session.service';
import { TIME_CONSTANTS } from '@/constants/time';
import { DateTimeUtil } from '@/shared/utils/datetime.util';

@Injectable()
export class AuthService {
    constructor(
        private readonly accountService: AccountService,
        private readonly accountSessionService: AccountSessionService,
    ) {}

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

    async login(authLoginDto: AuthLoginDto, IPAddress: string, userAgent: string): Promise<any> {
        const { keyword, password } = authLoginDto;
        const existingAccount = await this.accountService.findAccountByLogin(keyword);
        if (!existingAccount) {
            throw new ConflictException('Incorrect keyword or password');
        }

        const isPasswordMatched: boolean = await BcryptHelper.compare(password, existingAccount.password);
        if (!isPasswordMatched) {
            // TODO: Add failed login attempt logic here
            throw new ConflictException('Incorrect keyword or password');
        }

        const accessToken: string = JwtHelper.generateAccessToken(
            this.getAccountTokenPayload(existingAccount),
            existingAccount.private_key,
        );
        const refreshToken: string = JwtHelper.generateRefreshToken(
            { id: existingAccount?.id, invokedAt: Date.now() },
            existingAccount.private_key,
        );

        // Create new account session
        await this.accountSessionService.createNewAccountSession(
            {
                accountId: existingAccount.id,
                refreshToken,
                refreshTokenExpire: DateTimeUtil.generateDateFromNow(TIME_CONSTANTS.REFRESH_TOKEN_EXPIRE_DAYS),
            },
            IPAddress,
            userAgent,
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
