'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faLocationDot, faCalendar } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useFetchData } from '@/hooks/data/useFetchData';
import { UserPublicProfile } from '../../../../types/gema';
import React, { useEffect, useMemo, useState } from 'react';
import useAuth from '@/hooks/auth/useAuth';
import api from '@/services/api';
import { ToastMessage } from '@/components/common/toast/ToastMessage';
import { useToast } from '@/hooks/ui/useToast';
import { extractErrorMessage } from '@/utils/handleApiError';
import GemaFeed from '@/components/gema/GemaFeed';

type TabKey = 'posts' | 'replies' | 'media' | 'likes';

export default function MyProfileInner({ userId, username }: { userId: string; username: string }) {
  const [activeTab, setActiveTab] = useState<TabKey>('posts');

  const tabs = [
    { key: 'posts', label: 'Posts' },
    { key: 'replies', label: 'Replies' },
    { key: 'media', label: 'Media' },
    { key: 'likes', label: 'Likes' },
  ] as const;

  const { data: userPublicData, loading: userProfileLoading } =
    useFetchData<UserPublicProfile>(`user/profile/${username}`);

  const { toasts, showToast } = useToast();

  const profileView = useMemo(() => {
    const displayName =
      `${userPublicData?.firstname ?? ''} ${userPublicData?.lastname ?? ''}`.trim() || 'User';

    const uname = userPublicData?.username ?? username;

    const avatarUrl =
      userPublicData?.avatar ||
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTBA57d__PXonmFyFDla6f2WRtfPvP9an3YA&s';

    const bannerUrl =
      userPublicData?.banner ||
      'https://images.unsplash.com/photo-1503264116251-35a269479413?q=80&w=1200';

    const joinedText = userPublicData?.createdAt
      ? new Date(String(userPublicData.createdAt)).toLocaleDateString('id-ID', {
          month: 'long',
          year: 'numeric',
        })
      : null;

    return {
      id: userPublicData?.id ?? '',
      displayName,
      username: uname,
      avatarUrl,
      bannerUrl,
      joinedText,
      biography: userPublicData?.biography ?? '',
      location: userPublicData?.location ?? '',
      website: userPublicData?.website ?? '',
      followingCount: userPublicData?.followingCount,
      followersCount: userPublicData?.followersCount,
    };
  }, [userPublicData, username]);

  const { user: authProfile } = useAuth();
  const isMyProfile = authProfile?.username === profileView.username;
  const [isFollowing, setIsFollowing] = useState(false);

  const isFollowingEnabled = !!authProfile?.id && !!profileView.id && !isMyProfile;

  const { data: isFollowingRawData, loading: isFollowingLoading } = useFetchData<boolean>(
    isFollowingEnabled ? `/follow/isfollowing/${authProfile!.id}/${profileView.id}` : undefined,
    { enabled: isFollowingEnabled }
  );

  useEffect(() => {
    if (!isFollowingLoading && isFollowingRawData !== null) {
      setIsFollowing(!!isFollowingRawData);
    }
  }, [isFollowingLoading, isFollowingRawData]);

  const handleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      await api.post(`/follow/${profileView.id}`, {}, { withCredentials: true });

      setIsFollowing((prev) => {
        const next = !prev;
        showToast(`You have successfully ${next ? 'followed' : 'unfollowed'} this user.`);
        return next;
      });
    } catch (err) {
      console.log(`Failed to follow user: ${err}`);
      showToast(extractErrorMessage(err), 'error');
    }
  };

  const isLoading = userProfileLoading;


  const endpointByTab = useMemo<Record<TabKey, string>>(() => {
    return {
      posts: `/gema/author/${userId}?tab=posts`,
      replies: `/gema/author/${userId}?tab=replies`,
      media: `/gema/author/${userId}?tab=media`,
      likes: `/gema/author/${userId}?tab=likes`,
    };
  }, [userId]);

  const emptyTextByTab = useMemo<Record<TabKey, string>>(
    () => ({
      posts: 'Belum ada post di tab ini.',
      replies: 'Belum ada reply di tab ini.',
      media: 'Belum ada media di tab ini.',
      likes: 'Belum ada likes di tab ini.',
    }),
    []
  );

  return (
    <>
      <ToastMessage toasts={toasts} />

      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <div className="h-48 rounded-b-xl overflow-hidden">
            <img src={profileView.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
          </div>

          <div className="absolute left-6 -bottom-12 z-10">
            <div className="avatar">
              <div className="w-24 h-24 rounded-full ring ring-base-200 ring-offset-2 ring-offset-base-100">
                <img src={profileView.avatarUrl} alt="Profile" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">
                {userProfileLoading ? 'Loading...' : profileView.displayName}
              </h1>
              <p className="text-sm opacity-70">@{profileView.username}</p>
            </div>

            {isMyProfile && (
              <Link href="/profile/edit" className="btn btn-sm btn-outline rounded-full">
                Edit Profile
              </Link>
            )}

            {!isMyProfile && (
              <button
                onClick={handleFollow}
                type="button"
                className="btn btn-sm bg-white text-black rounded-full"
                disabled={!isFollowingEnabled}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>

          {!!profileView.biography && <p className="mt-3 text-sm">{profileView.biography}</p>}

          <div className="flex flex-wrap gap-4 mt-3 text-sm opacity-80">
            {!!profileView.location && (
              <span className="flex items-center gap-1">
                <FontAwesomeIcon icon={faLocationDot} /> {profileView.location}
              </span>
            )}

            {!!profileView.website && (
              <span className="flex items-center gap-1">
                <FontAwesomeIcon icon={faLink} />
                <Link
                  href={profileView.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {profileView.website.replace(/^https?:\/\//, '')}
                </Link>
              </span>
            )}

            <span className="flex items-center gap-1">
              <FontAwesomeIcon icon={faCalendar} /> Joined {profileView.joinedText ?? '—'}
            </span>
          </div>

          <div className="flex gap-6 mt-3 text-sm">
            <Link href={`/profile/${username}/followers`} className="hover:underline">
              <span className="font-bold">{profileView.followersCount}</span> Followers
            </Link>

            <Link href={`/profile/${username}/followings`} className="hover:underline ml-4">
              <span className="font-bold">{profileView.followingCount}</span> Following
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div>
        <div className="-mx-4 px-4 bg-base-200/90 supports-[backdrop-filter]:bg-base-200/60 backdrop-blur border-b border-base-300">
          <div className="max-w-2xl mx-auto">
            <div className="flex w-full">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-3 text-center ${
                    activeTab === tab.key
                      ? 'border-b-2 border-primary font-semibold'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  disabled={isLoading}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Feed (generic) */}
      <div className="max-w-2xl mx-auto">
        <div className="mt-4">
          {isLoading ? (
            <div className="p-8 text-center text-base-content/60">Loading...</div>
          ) : (
            <GemaFeed
              key={activeTab} 
              endpoint={endpointByTab[activeTab]}
              limit={10}
              enabled={Boolean(userId)}
              emptyText={emptyTextByTab[activeTab]}
            />
          )}
        </div>
      </div>
    </>
  );
}
