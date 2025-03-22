"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
        router.push("/"); // Redirect ke login kalau belum login
        }
    }, [status, router]);

    if (status === "loading") {
        return <div>Loading...</div>; // Bisa kasih loading state juga
    }

    return (
        <div>
        <h1>Dashboard</h1>
        <p>Welcome, {session?.user?.email}</p>
        </div>
    );
}
