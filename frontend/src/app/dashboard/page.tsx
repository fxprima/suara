"use client";

import { AuthGuard } from "@/components/AuthGuard";
import api from "@/services/api";
import { signOut, useSession } from "next-auth/react";

export default function Dashboard() {
    const { data: session, status } = useSession();

    const clickme = async () => {
        try {
            const res = api.get('/gemas/hello',)
            console.log(res)
        } catch (error:any) {
            console.log(error.response.data.message)
        } finally {
            console.log('finally')
            //... any cleanup code goes here

        }
    }

    const logout = async () => {
        await signOut();
    }

    return (
        <AuthGuard redirectTo="/" requireAuth={true}>
        <div>
            <h1>Dashboard</h1>
            <button onClick={clickme} className="btn btn-primary">Click </button>
            <button onClick={logout} className="btn btn-primary">Loogut </button>
            <p>Welcome, {session?.user?.email}</p>
        </div>
        </AuthGuard>
    );
}
