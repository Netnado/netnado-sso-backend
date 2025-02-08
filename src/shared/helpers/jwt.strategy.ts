import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_CONSTANTS } from '@/constants/jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_CONSTANTS.SECRET,
            issuer: JWT_CONSTANTS.ISSUER,
            audience: JWT_CONSTANTS.AUDIENCE,
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, email: payload.email };
    }
}
