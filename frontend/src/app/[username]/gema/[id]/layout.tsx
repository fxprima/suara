'use client';

import { ReactNode } from 'react';
import { AuthGuard } from '@/components/guard/AuthGuard';
import LeftSidebar from '@/components/sidebar/LeftSidebar';
import RightSidebar from '@/components/sidebar/RightSidebar';

export default function GemadLayout({ children }: { children: ReactNode }) {
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
