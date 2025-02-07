import * as jwt from 'jsonwebtoken';
import { TIME_CONSTANTS } from '@/constants/time';

export class JwtHelper {
    static generateToken(payload: object, privateKey: string, expiresIn: string): string {
        return jwt.sign(payload, privateKey, { expiresIn, algorithm: 'RS256' });
    }

    static verifyToken(token: string, publicKey: string): any {
        return jwt.verify(token, publicKey, {
            algorithms: ['RS256'],
        });
    }

    static generateAccessToken(payload: object, privateKey: string): string {
        return JwtHelper.generateToken(payload, privateKey, TIME_CONSTANTS.ACCESS_TOKEN_EXPIRE);
    }

    static generateRefreshToken(payload: object, privateKey: string): string {
        return JwtHelper.generateToken(payload, privateKey, TIME_CONSTANTS.REFRESH_TOKEN_EXPIRE);
    }

    static checkIfTokenExpiredError(error: any) {
        return error instanceof jwt.TokenExpiredError;
    }

    static checkIfTokenSignatureError(error: any) {
        return error instanceof jwt.JsonWebTokenError && error.message === 'invalid signature';
    }
}
