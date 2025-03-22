import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import api from "@/services/api";

export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: process.env.NEXTAUTH_SECRET as string,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {

                    const res = await api.post("/auth/signin", {
                        email: credentials?.email,
                        password: credentials?.password,
                    });

                    const responseData = res.data.data;
                    if (responseData?.accessToken) {
                        return {
                            id: responseData.user?.id, 
                            email: String(credentials?.email),
                            accessToken: responseData.accessToken,
                        };
                    }
                    return null;
                } catch (error: any) {
                    console.error(error.response?.data?.message);
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 15 * 60, // 15 menit
    },
    callbacks: {
        async jwt({ token, user }: { token: any; user?: any }) {
            if (user?.accessToken) 
                token.accessToken = user.accessToken;
            
            return token;
        },
        async session({ session, token }: { session: any; token: any }) {
            session.accessToken = token.accessToken;
            return session;
        },
    },
    pages: {
        signIn: "/", 
    },
});
