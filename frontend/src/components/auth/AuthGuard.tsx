'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import LoadingScreen from '../common/loader/LoadingScreen';
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
        if (!loading) {
            // Logic redirect tetep di sini buat trigger navigasinya
            if (requireAuth && !isAuthenticated) {
                router.replace(redirectTo);
            }
            if (!requireAuth && isAuthenticated) {
                router.replace('/dashboard');
            }
        }
    }, [loading, isAuthenticated, requireAuth, redirectTo, router]);

    // 1. Kalo masih loading auth -> Tampilkan Loader
    if (loading) {
        return <LoadingScreen />;
    }

    // 2. BLOCKING: Kalo butuh auth tapi user ga login -> Tampilkan Loader/Null (JANGAN CHILDREN)
    // Ini nahan biar halaman Profile ga bocor pas lagi proses redirect
    if (requireAuth && !isAuthenticated) {
        return <LoadingScreen />; // atau return null;
    }

    // 3. BLOCKING: Kebalikannya (misal halaman Login diakses user yg udh login)
    if (!requireAuth && isAuthenticated) {
        return <LoadingScreen />; // atau return null;
    }

    // 4. Lolos semua seleksi? Baru boleh render isinya
    return <>{children}</>;
}