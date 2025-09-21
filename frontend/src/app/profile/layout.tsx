'use client';

import { ReactNode } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import RightSidebar from '@/components/layout/sidebar/RightSidebar';
import LeftSidebar from '@/components/layout/sidebar/LeftSidebar';

export default function ProfileLayout({ children }: { children: ReactNode }) {
    return (
        <AuthGuard requireAuth={true} redirectTo="/">
            <div className="dashboard-layout flex h-screen">
                <LeftSidebar />
                <main className="flex-1 p-4 bg-base-200 overflow-y-scroll">{children}</main>
                <RightSidebar />
            </div>
        </AuthGuard>
    );
}
