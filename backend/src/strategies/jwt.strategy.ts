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

    async validate(payload: JwtPayload): Promise<UserPayload> {
        return {
            id: payload.sub,
            username: payload.username,
        }
    }
}
