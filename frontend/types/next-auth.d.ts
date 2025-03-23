import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import type { JWT as DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
    interface Session {
        accessToken?: string;
        user: {
            id: string;
            email: string;
            username?: string;
            firstname?: string;
            lastname?: string;
            dob?: string;
            phone?: string;
            createdAt?: string;
            updatedAt?: string;
        } & DefaultSession['user'];
    }

    interface User extends DefaultUser {
        id: string;
        accessToken?: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT extends DefaultJWT {
        accessToken?: string;
    }
}
