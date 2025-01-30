import { Injectable } from '@nestjs/common';
import { TokenService } from '@/shared/utils/token.service';

@Injectable()
export class AuthService {
  constructor(private readonly tokenService: TokenService) {}

  login(user: any) {
    return this.tokenService.generateToken({ userId: user.id });
  }
}
