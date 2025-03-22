"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/AuthGuard";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();


    return (

        <div>
            <h1>Dashboard</h1>
            <p>Welcome, {session?.user?.email}</p>
        </div>

    );
}
