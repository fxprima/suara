import { UserPayload } from "./user-payload.interface";

export interface JwtPayload extends UserPayload{
    sub: string;
    iat?: number;
    exp?: number;
}