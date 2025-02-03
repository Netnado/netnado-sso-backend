import { Injectable } from '@nestjs/common';
import { AccountService } from '@/modules/account/account.service';
import { AuthSignupDto } from './dto/auth-signup.dto';

@Injectable()
export class AuthService {
    constructor(private readonly accountService: AccountService) {}

    async signup(authSignupDto: AuthSignupDto): Promise<any> {
        const { email, password, username } = authSignupDto;
        const existingAccount = await this.accountService.findAccountByEmail(email);
        if (existingAccount) {
            throw new Error('Email is already in use');
        }

        const newUser = await this.accountService.createNewAccount({
            email,
            password,
            username,
        });
        return { user: newUser };
    }

    async login(user: any): Promise<any> {
        return {
            user: user,
            accessToken: 'abcxyz',
        };
    }
}
