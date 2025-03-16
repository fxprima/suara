import NextAuth, { NextAuthOptions, SessionStrategy } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import api from '@/services/api';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const res = await api.post('/auth/login', {
                    email: credentials?.email,
                    password: credentials?.password,
                });

                const data = res.data;
                if (data?.accessToken) {
                    return {
                        id: data.userId,
                        email: credentials?.email,
                        accessToken: data.accessToken,
                    };
                }
                return null;
            },
        }),
    ],
    session: {
        strategy: 'jwt' as SessionStrategy,
        maxAge: 15 * 60,
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user?.accessToken) {
                token.accessToken = user.accessToken;
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            return session;
        },

    },
    pages: {
        signIn: '/login',
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
