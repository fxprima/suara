'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import LoadingScreen from '../ui/loader/LoadingScreen';
import useAuth from '@/hooks/auth/useAuth';

type Props = {
    children: ReactNode;
    redirectTo?: string;
    requireAuth?: boolean;
};

export function AuthGuard({ children, redirectTo = '/', requireAuth = true }: Props) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;
        if (requireAuth && !isAuthenticated) router.replace(redirectTo);
        if (!requireAuth && isAuthenticated) router.replace('/dashboard');
    }, [loading, isAuthenticated, requireAuth, redirectTo, router]);

    if (loading) return <LoadingScreen />;
    return <>{children}</>;
}
