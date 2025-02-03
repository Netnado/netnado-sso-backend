import { Injectable } from '@nestjs/common';
import { TokenService } from '@/shared/utils/token.service';

@Injectable()
export class AuthService {
    constructor(private readonly tokenService: TokenService) {}

    async signup(user: any) {
        return user;
    }

    login(user: any) {
        return user;
    }
}
