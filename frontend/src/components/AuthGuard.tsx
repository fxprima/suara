import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import LoadingScreen from "./loader/LoadingScreen";

type Props = {
    children: ReactNode;
    redirectTo?: string;
    requireAuth?: boolean;
};

export function AuthGuard({ children, redirectTo = "/", requireAuth = true }: Props) {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (requireAuth && status === "unauthenticated") 
            router.replace(redirectTo);
        
        if (!requireAuth && status === "authenticated") 
            router.replace("/dashboard");
        
    }, [status, requireAuth, redirectTo, router]);

    if (status === "loading") 
        return <LoadingScreen />;

    return <>{children}</>;
}
