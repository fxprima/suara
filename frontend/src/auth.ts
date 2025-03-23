import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import api from "@/services/api";

export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: process.env.NEXTAUTH_SECRET as string,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {},
            async authorize(credentials: any) {
                try {
                    const res = await api.post(
                        "/auth/signin",
                        {
                            email: credentials.email,
                            password: credentials.password,
                        },
                        { withCredentials: true }
                    );

                    const responseData = res.data.data;
                    if (responseData?.accessToken) {
                        return {
                            ...responseData.user,
                            accessToken: responseData.accessToken,
                        };
                    }
                    return null;
                } catch (error) {
                    console.error("Authorize error", error);
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 hari
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
            }
            return token;
        },
        async session({ session, token }) {
            if (token.user) {
                session.user = {
                    ...session.user,
                    ...token.user,
                };
            }
            return session;
        },
    },
    pages: {
        signIn: "/",
    },
});
