'use client';

import { useMemo, useState } from 'react';
import useAuth from '@/hooks/auth/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faLocationDot, faCalendar } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { GemaCard } from '@/components/gema/GemaCard';
import { useFetchData } from '@/hooks/data/useFetchData';
import { GemaType, UserPublicProfile } from '../../../../types/gema';

type TabKey = 'posts' | 'replies' | 'media' | 'likes';

export default function MyProfilePage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<TabKey>('posts');

    const tabs = [
        { key: 'posts', label: 'Posts' },
        { key: 'replies', label: 'Replies' },
        { key: 'media', label: 'Media' },
        { key: 'likes', label: 'Likes' },
    ] as const;

    const { data: userPublicData, loading: userProfile } = useFetchData<UserPublicProfile>(
        `user/profile/${user?.username}`
    );

    // --- safe fallbacks ---
    const displayName =
        `${userPublicData?.firstname ?? ''} ${userPublicData?.lastname ?? ''}`.trim() || 'User';
    const username = userPublicData?.username ?? 'felixdev';

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
        : 'January 2025';

    const { data: userGemas, loading: userGemasLoading } = useFetchData<GemaType[]>(
        user ? `gema/author/${user.id}` : ''
    );

    const allPosts = userGemas || [];

    console.log(allPosts);

    const posts = allPosts.filter((p) => p.parentId === null);
    const mediaOnly = allPosts.filter((p) => (p.media?.length ?? 0) > 0);
    const replies = allPosts.filter((p) => p.parentId !== null);

    const { data: likedGemas, loading: likedGemasLoading } = useFetchData<GemaType[]>(
        user ? `gema/likes/${user.id}` : ''
    );

    console.log(replies);

    console.log(`likedGemas: `);
    console.log(likedGemas);

    const likes = likedGemas || [];

    const tabMap: Record<TabKey, GemaType[]> = {
        posts,
        replies,
        media: mediaOnly,
        likes,
    };

    const activeFeed = tabMap[activeTab];

    return (
        <>
            {/* ===== Header (container) ===== */}
            <div className="max-w-2xl mx-auto">
                {/* Banner */}
                <div className="relative">
                    <div className="h-48 rounded-b-xl overflow-hidden">
                        <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute left-6 -bottom-12 z-10">
                        <div className="avatar">
                            <div className="w-24 h-24 rounded-full ring ring-base-200 ring-offset-2 ring-offset-base-100">
                                <img src={avatarUrl} alt="Profile" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Header Info */}
                <div className="mt-16 px-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-xl font-bold">{displayName}</h1>
                            <p className="text-sm opacity-70">@{username}</p>
                        </div>
                        <Link href="/profile/edit" className="btn btn-sm btn-outline rounded-full">
                            Edit Profile
                        </Link>
                    </div>

                    {userPublicData?.biography && (
                        <p className="mt-3 text-sm">{userPublicData.biography}</p>
                    )}

                    <div className="flex flex-wrap gap-4 mt-3 text-sm opacity-80">
                        {userPublicData?.location && (
                            <span className="flex items-center gap-1">
                                <FontAwesomeIcon icon={faLocationDot} /> {userPublicData.location}
                            </span>
                        )}
                        {userPublicData?.website && (
                            <span className="flex items-center gap-1">
                                <FontAwesomeIcon icon={faLink} />
                                <Link
                                    href={userPublicData.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                >
                                    {userPublicData.website.replace(/^https?:\/\//, '')}
                                </Link>
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            <FontAwesomeIcon icon={faCalendar} /> Joined {joinedText}
                        </span>
                    </div>

                    <div className="flex gap-6 mt-3 text-sm">
                        <span>
                            <strong>123</strong> Following
                        </span>
                        <span>
                            <strong>456</strong> Followers
                        </span>
                    </div>
                </div>
            </div>

            {/* ===== Tabs (sticky, full-bleed di dalam <main>) ===== */}
            <div className="">
                {/* bar yang nge-bleed sampai tepi <main> dengan kompensasi padding p-4 */}
                <div className="-mx-4 px-4 bg-base-200/90 supports-[backdrop-filter]:bg-base-200/60 backdrop-blur border-b border-base-300">
                    {/* konten tetap center mengikuti max-w-2xl */}
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
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== Feed (container) ===== */}
            <div className="max-w-2xl mx-auto">
                <div className="mt-4">
                    {activeFeed.length === 0 ? (
                        <div className="p-8 text-center text-base-content/60">
                            Belum ada konten di tab ini.
                        </div>
                    ) : (
                        <div className="divide-y divide-base-300">
                            {activeFeed.map((p) => (
                                <GemaCard
                                    key={p.id}
                                    id={p.id}
                                    authorName={`${p.author.firstname} ${p.author?.lastname}`}
                                    username={p.author.username}
                                    avatar={p.author.avatar ?? '/default-avatar.svg'}
                                    content={p.content}
                                    media={p.media}
                                    createdAt={p.createdAt}
                                    viewsCount={p.viewsCount}
                                    likesCount={p.likedBy.length}
                                    repliesCount={p.repliesCount}
                                    onReply={() => {}}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
