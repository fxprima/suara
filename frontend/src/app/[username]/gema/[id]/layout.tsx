'use client';

import { ReactNode } from 'react';
import RightSidebar from '@/components/layout/sidebar/RightSidebar';
import LeftSidebar from '@/components/layout/sidebar/LeftSidebar';

export default function GemaLayout({ children }: { children: ReactNode }) {
    return (
        <div className="dashboard-layout flex h-screen">
            <LeftSidebar />
            <main className="flex-1 p-4 bg-base-200 overflow-y-scroll">{children}</main>
            <RightSidebar />
        </div>
    );
}
