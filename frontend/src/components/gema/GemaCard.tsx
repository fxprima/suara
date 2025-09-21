'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHeart,
    faComment,
    faRetweet,
    faChartLine,
    faBookmark,
    faShare,
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import MediaPreviewModal from '../common/media/MediaPreviewModal';
import GemaMediaGrid from '../common/media/GemaMediaGrid';
import isGemaLikedByUser from '@/utils/gema';
import { GemaType } from '../../../types/gema';
import useAuth from '@/hooks/auth/useAuth';

interface GemaCardProps {
    key: string;
    gema: GemaType;
    onReply?: () => void;
}

export const GemaCard: React.FC<GemaCardProps> = ({ gema, onReply }) => {
    const router = useRouter();
    const { user: loggedUser } = useAuth();
    const videoRefs = React.useRef<HTMLVideoElement[]>([]);

    const [preview, setPreview] = React.useState({ open: false, index: 0 });

    console.log('Gema in Card:');
    console.log(gema);

    React.useEffect(() => {
        const iosInline = (v: HTMLVideoElement) => {
            v.setAttribute('playsinline', 'true');
            v.setAttribute('webkit-playsinline', 'true');
        };

        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    const v = e.target as HTMLVideoElement;
                    if (e.isIntersecting) {
                        // pause semua video lain
                        videoRefs.current.forEach((o) => {
                            if (o && o !== v) o.pause();
                        });
                        v.play().catch(() => {
                            /* ignore */
                        });
                    } else {
                        v.pause();
                    }
                });
            },
            { threshold: 0.5 }
        );

        videoRefs.current.forEach((v) => {
            if (!v) return;
            iosInline(v);
            obs.observe(v);
        });

        return () => obs.disconnect();
    }, []);

    return (
        <div
            className="border-b border-base-300 pb-4 pt-2 px-1 transition duration-150 ease-in-out 
             hover:bg-base-100 hover:shadow-sm cursor-pointer rounded-xl"
            onClick={() => router.push(`/${gema.author.username}/gema/${gema.id}`)}
        >
            {/* Header */}
            <div className="flex items-start space-x-3">
                <div className="avatar">
                    <div className="w-10 rounded-full">
                        <img src={gema.author.avatar ?? '/default-avatar.svg'} alt="avatar" />
                    </div>
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold leading-none mb-2">{`${gema.author.firstname} ${gema.author.lastname}`}</p>
                            <p className="text-sm text-gray-500 leading-none">
                                @{gema.author.username}
                            </p>
                        </div>
                        {gema.createdAt && (
                            <span className="text-xs text-gray-400">
                                {new Date(gema.createdAt).toLocaleDateString('id-ID', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: '2-digit',
                                })}
                            </span>
                        )}
                    </div>
                    {/* Content */}
                    <div className="mt-2 whitespace-pre-wrap text-base">{gema.content}</div>

                    {/* Media */}
                    <GemaMediaGrid
                        media={gema.media}
                        className="mt-3"
                        onOpenPreview={(index) => setPreview({ open: true, index })}
                    />

                    <MediaPreviewModal
                        open={preview.open}
                        items={gema.media || []}
                        initialIndex={preview.index}
                        onClose={() => setPreview((p) => ({ ...p, open: false }))}
                    />

                    {/* Engagement */}
                    <div className="flex justify-between text-sm text-gray-500 mt-3 px-2 text-center">
                        <div
                            className="flex items-center space-x-1 hover:text-primary cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                onReply?.();
                            }}
                        >
                            <FontAwesomeIcon icon={faComment} className="w-4 h-4" />
                            <span>{gema.repliesCount}</span>
                        </div>
                        <div className="flex items-center space-x-1 hover:text-green-500 cursor-pointer">
                            <FontAwesomeIcon icon={faRetweet} className="w-4 h-4" />
                            <span>0</span>
                        </div>
                        <div
                            className={`flex items-center space-x-1 hover:text-pink-500 cursor-pointer 
                            ${isGemaLikedByUser(gema, loggedUser?.id ?? '') ? 'text-pink-500' : ''}
                        `}
                        >
                            <FontAwesomeIcon icon={faHeart} className="w-4 h-4" />
                            <span>{gema.likedBy.length}</span>
                        </div>
                        <div className="flex items-center space-x-1 hover:text-primary cursor-pointer">
                            <FontAwesomeIcon icon={faChartLine} className="w-4 h-4" />
                            <span>{gema.viewsCount}</span>
                        </div>
                        <div className="flex items-center space-x-1 hover:text-primary cursor-pointer">
                            <FontAwesomeIcon icon={faBookmark} className="w-4 h-4" />
                        </div>
                        <div className="flex items-center space-x-1 hover:text-primary cursor-pointer">
                            <FontAwesomeIcon icon={faShare} className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
