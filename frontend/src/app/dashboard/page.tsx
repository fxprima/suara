import { AuthGuard } from '@/components/AuthGuard';
import MainFeed from '@/components/feed/MainFeed';
import RightSidebar from '@/components/sidebar/RightSidebar';
import LeftSidebar from '@/components/sidebar/LeftSidebar';

export default function Dashboard() {
    return (
        <AuthGuard requireAuth={true} redirectTo="/">
            <div className="flex h-screen">
                <LeftSidebar />
                <MainFeed />
                <RightSidebar />
            </div>
        </AuthGuard>
    );
}
