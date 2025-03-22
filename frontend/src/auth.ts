import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import api from "@/services/api";

export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: process.env.NEXTAUTH_SECRET as string,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: { },
            async authorize(credentials: any) {
                try {
                    const res = await api.post("/auth/signin", {
                        email: credentials.email,
                        password: credentials.password,
                    }, {
                        withCredentials: true
                    });
            
                    const responseData = res.data.data;
                    if (responseData?.accessToken) {
                        return {
                            id: responseData.user.id,
                            email: responseData.user.email,
                            accessToken: responseData.accessToken,
                        };
                    }
                    return null;
                } catch (error) {
                    console.error("Authorize error", error);
                    return null;
                }
            }
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 30, // 15 menit
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
