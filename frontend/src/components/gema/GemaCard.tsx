'use client';

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
import { GemaType } from '../../../types/gema';
import useAuth from '@/hooks/auth/useAuth';
import { FC, useEffect, useRef, useState } from 'react';
import api from '@/services/api';

interface GemaCardProps {
    gema: GemaType;
    onReply?: () => void;
}

export const GemaCard: FC<GemaCardProps> = ({ gema, onReply }) => {
    const router = useRouter();
    const { user: loggedUser } = useAuth();

    const videoRefs = useRef<HTMLVideoElement[]>([]);
    const [preview, setPreview] = useState({ open: false, index: 0 });

    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    useEffect(() => {
        setLikesCount(gema?.likedBy?.length ?? 0);
        if (!loggedUser?.id) {
            setIsLiked(false);
            return;
        }

        const liked = (gema?.likedBy ?? []).some((u) => u.user.id === loggedUser.id);
        setIsLiked(liked);
    }, [gema, loggedUser?.id]);

    const handleLikeGema = async (gemaId: string) => {
        if (!loggedUser?.id)
            return;

        setIsLiked((prev) => !prev);
        setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
        
        try {
            await api.patch(`/gema/${gemaId}/likes`, {}, { withCredentials: true });
        } catch (err) {
            setIsLiked((prev) => !prev);
            setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
        }
    };

    useEffect(() => {
        const iosInline = (v: HTMLVideoElement) => {
            v.setAttribute('playsinline', 'true');
            v.setAttribute('webkit-playsinline', 'true');
        };

        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    const v = e.target as HTMLVideoElement;
                    if (e.isIntersecting) {
                        videoRefs.current.forEach((o) => {
                            if (o && o !== v) o.pause();
                        });
                        v.play().catch(() => { });
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
                            <p className="text-sm text-gray-500 leading-none">@{gema.author.username}</p>
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

                    <div className="mt-2 whitespace-pre-wrap text-base">{gema.content}</div>

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

                        <div className="flex items-center gap-2 group">
                            <FontAwesomeIcon
                                icon={faHeart}
                                className={`text-lg cursor-pointer transition-colors ${isLiked ? 'text-red-500' : 'group-hover:text-red-500'
                                    }`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleLikeGema(gema.id);
                                }}
                            />
                            <span>{likesCount}</span>
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
