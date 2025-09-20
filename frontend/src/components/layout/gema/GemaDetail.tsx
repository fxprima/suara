'use client';

import { useFetchData } from '@/hooks/data/useFetchData';
import Image from 'next/image';
import { redirect, useParams } from 'next/navigation';
import { GemaType, GemaTypeDetail } from '../../../../types/gema';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faRetweet, faHeart, faEye } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/ui/useToast';
import { handleReply } from '@/utils/handleReply';
import { ReplyGemaModal } from '../../gema/ReplyGemaModal';
import { ToastMessage } from '../../common/toast/ToastMessage';
import { useSilentRefetch } from '@/hooks/data/useSilentRefetch';
import ReplyGema from '@/components/gema/ReplyGema';
import api from '@/services/api';
import useAuth from '@/hooks/auth/useAuth';
import { useRouter } from 'next/navigation';
import isGemaLikedByUser from '@/utils/gema';
import GemaMediaGrid from '@/components/common/media/GemaMediaGrid';
import MediaPreviewModal from '@/components/common/media/MediaPreviewModal';

export default function GemaDetail() {
    const router = useRouter();
    const { username, id } = useParams() as { username: string; id: string };
    const {
        data: gema,
        loading: loadingFetchGema,
        error: errorFetchGema,
        refetch: refetchGema,
        silentRefetch: silentRefetchGema,
    } = useFetchData<GemaTypeDetail>(`/gema/${id}`);

    const { user: loggedUser } = useAuth();

    console.log(gema);

    const [likesCount, setLikesCount] = useState(0);

    const [preview, setPreview] = useState({ open: false, index: 0 });

    useSilentRefetch(silentRefetchGema);

    useEffect(() => {
        if (id)
            api.patch(`/gema/${id}/views`).catch((err) =>
                console.error('Failed to increment views:', err)
            );
    }, [id]);

    const hasInitLikes = useRef(false);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        if (gema && !hasInitLikes.current) {
            setLikesCount(gema.likedBy.length);
            setIsLiked(gema.likedBy.some((u) => u.user.id === loggedUser!.id));
            hasInitLikes.current = true;
        }
    }, [gema, loggedUser]);

    const [replyToGema, setReplyToGema] = useState<GemaType | null>(null);
    const { toasts, showToast } = useToast();

    const handleLikes = async (e: React.MouseEvent) => {
        e.preventDefault();
        setIsLiked((prev) => !prev);
        setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

        try {
            await api.patch(`/gema/${gema!.id}/likes`);
        } catch (err) {
            setIsLiked((prev) => !prev);
            setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
        }
    };

    const handleSubmitReply = async (formData: FormData) => {
        await handleReply({
            formData: formData,
            parentId: gema?.id,
            refetchFn: refetchGema,
            showToast: showToast,
            onSuccess: () => setReplyToGema(null),
        });
    };

    // ===== ShowMedia setup (autoplay muted + pause saat out of view) =====
    const videoRefs = useRef<HTMLVideoElement[]>([]);

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
                        v.play().catch(() => {});
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
    }, [gema?.media?.length]);

    const attachRef = (idx: number) => (el: HTMLVideoElement | null) => {
        if (el) videoRefs.current[idx] = el;
    };

    const renderTile = (
        item: { type: 'image' | 'video'; url: string },
        idx: number,
        extraClass = ''
    ) => (
        <div key={idx} className={`relative overflow-hidden rounded-xl ${extraClass}`}>
            {item.type === 'image' ? (
                <img
                    src={item.url}
                    alt={`media-${idx}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
            ) : (
                <div className="w-full h-full">
                    <video
                        ref={attachRef(idx)}
                        className="w-full h-full object-cover"
                        preload="metadata"
                        muted
                        loop
                        autoPlay
                        playsInline
                        onPlay={(e) => {
                            const current = e.currentTarget;
                            videoRefs.current.forEach((v) => {
                                if (v && v !== current) v.pause();
                            });
                        }}
                    >
                        <source src={item.url} />
                    </video>
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-md px-2 py-1 text-xs bg-black/60 text-white">
                        <span aria-hidden>▶</span>
                        <span>Video</span>
                    </div>
                </div>
            )}
        </div>
    );
    // ====================================================================

    if (loadingFetchGema) {
        return (
            <div className="w-full h-full flex items-center justify-center py-20">
                <span className="loading loading-spinner text-primary w-12 h-12"></span>
            </div>
        );
    }

    if (!gema) {
        console.log('error:', errorFetchGema);
        return (
            <div className="text-center py-20">
                <p className="text-center text-sm text-gray-500">Gema not found.</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
            <ToastMessage toasts={toasts} />
            {/* Gema utama */}
            <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                    <img
                        src={gema.author.avatar || '/default-avatar.svg'}
                        alt="avatar"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Konten */}
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm">
                            {gema.author.firstname} {gema.author.lastname}
                        </p>
                        <p className="text-sm text-gray-500">@{username}</p>
                    </div>

                    <p className="text-xl font-semibold whitespace-pre-wrap">{gema.content}</p>

                    <GemaMediaGrid
                        media={gema.media}
                        className="mt-3"
                        onOpenPreview={(index) => setPreview({ open: true, index })}
                    />

                    <MediaPreviewModal
                        open={preview.open}
                        items={gema.media ?? []}
                        initialIndex={preview.index}
                        onClose={() => setPreview((p) => ({ ...p, open: false }))}
                    />

                    <div className="text-sm text-gray-500 mt-2">
                        {new Date(gema.createdAt).toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Reaction Bar */}
            <div className="flex justify-around items-center text-sm text-gray-600 border-y py-3">
                <div
                    className="flex items-center gap-2 hover:text-primary cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        setReplyToGema(gema);
                    }}
                >
                    <FontAwesomeIcon icon={faComment} className="text-lg" />
                    <span>{gema.repliesCount}</span>
                </div>
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faRetweet} className="text-lg" />
                    <span>{0}</span>
                </div>

                <div className="flex items-center gap-2 group">
                    <FontAwesomeIcon
                        icon={faHeart}
                        className={`text-lg cursor-pointer group-hover:text-red-500 transition-colors ${
                            isGemaLikedByUser(gema, loggedUser?.id ?? '') ? 'text-red-500' : ''
                        }`}
                        onClick={(e) => handleLikes(e)}
                    />
                    <span>{likesCount}</span>
                </div>

                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faEye} className="text-lg" />
                    <span>{gema.viewsCount}</span>
                </div>
            </div>

            {/* Replies*/}
            <div className="pt-6 space-y-6">
                {gema.replies?.map((reply) => (
                    <ReplyGema key={reply.id} reply={reply} refetchGema={silentRefetchGema} />
                ))}
            </div>

            {replyToGema && (
                <ReplyGemaModal
                    isOpen={true}
                    gema={replyToGema}
                    onClose={() => setReplyToGema(null)}
                    onSubmitReply={handleSubmitReply}
                />
            )}
        </div>
    );
}
