import { AuthGuard } from '@/components/auth/AuthGuard';
import ProfileEditPage from '@/components/layout/profile/EditProfile';

export default function EditProfile() {
    return (
        <AuthGuard requireAuth={true} redirectTo={'/'}>
            <ProfileEditPage />;
        </AuthGuard>
    )
}
