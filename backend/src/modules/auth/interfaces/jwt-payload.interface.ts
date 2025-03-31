export interface JwtPayload {
    sub: string;
    email: string;
    username: string;
    firstname: string;
    lastname: string;
    iat?: number;
    exp?: number;
}