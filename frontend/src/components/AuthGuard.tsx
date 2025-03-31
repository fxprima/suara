'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import LoadingScreen from './loader/LoadingScreen';

type Props = {
    children: ReactNode;
    redirectTo?: string;
    requireAuth?: boolean;
};

export function AuthGuard({ children, redirectTo = '/login', requireAuth = true }: Props) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        console.log('accessToken from localStorage:', token);
        setIsAuthenticated(!!token);
    }, []);

    useEffect(() => {
        console.log('AuthGuard state:', isAuthenticated, 'requireAuth:', requireAuth);
        if (isAuthenticated === null) return;
        if (requireAuth && !isAuthenticated) {
            router.replace(redirectTo);
        }
        if (!requireAuth && isAuthenticated) {
            router.replace('/dashboard');
        }
    }, [isAuthenticated, requireAuth, redirectTo, router]);

    if (isAuthenticated === null) return <LoadingScreen />;
    return <>{children}</>;
}
