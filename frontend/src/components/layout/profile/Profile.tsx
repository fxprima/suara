'use client';

import useAuth from '@/hooks/auth/useAuth';
import MyProfileInner from './MyProfileInner';
import { useParams } from 'next/navigation';
import { useFetchData } from '@/hooks/data/useFetchData';
import { UserPublicProfile } from '../../../../types/gema';

export default function ProfilePage() {
  const params = useParams() as { username?: string };
  const username = params?.username;

  const { user } = useAuth();

  const { data: userPublicData, loading: userProfileLoading } =
    useFetchData<UserPublicProfile>(
      username ? `user/profile/${username}` : undefined
    );

  if (username) {
    if (userProfileLoading) {
      return (
        <div className="max-w-2xl mx-auto p-8 text-center text-base-content/60">
          Loading...
        </div>
      );
    }

    if (!userPublicData) {
      return (
        <div className="max-w-2xl mx-auto p-8 text-center text-base-content/60">
          Account doesn't exist
        </div>
      );
    }

    return (
      <MyProfileInner userId={userPublicData.id} username={userPublicData.username} />
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center text-base-content/60">
        Loading...
      </div>
    );
  }

  return <MyProfileInner userId={user.id} username={user.username} />;
}
