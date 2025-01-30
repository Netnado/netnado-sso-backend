import * as jwt from 'jsonwebtoken';
import { JWT_CONSTANTS } from '@/constants/jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenService {
  private secret: string;
  private expiresIn: string;

  constructor(secret = JWT_CONSTANTS.SECRET, expiresIn = '15m') {
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  generateToken(payload: object): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  verifyToken(token: string): object | string {
    return jwt.verify(token, this.secret);
  }
}
