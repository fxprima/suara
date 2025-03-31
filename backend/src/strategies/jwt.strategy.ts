import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';
import { UserPayload } from 'src/modules/auth/interfaces/user-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || 'default_jwt_secret',
        });
    }

    validate(payload: JwtPayload): UserPayload {
        return {
            id: payload.sub,
            email: payload.email,
            username: payload.username,
            firstname: payload.firstname,
            lastname: payload.lastname
        }
    }
}
