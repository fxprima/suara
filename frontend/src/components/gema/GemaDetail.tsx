'use client';

import { useFetchData } from '@/hooks/useFetchData';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { GemaType, GemaTypeDetail } from '../../../types/gema';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faRetweet, faHeart, faEye } from '@fortawesome/free-solid-svg-icons';
import ReplyGema from './ReplyGema';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { handleReply } from '@/utils/handeReply';
import { ReplyModal } from '../modal/ReplyModal';
import { ToastMessage } from '../ui/toast/ToastMessage';
import { useSilentRefetch } from '@/hooks/useSilentRefetch';

export default function GemaDetail() {
    const { username, id } = useParams() as { username: string; id: string };
    const {
        data: gema,
        loading: loadingFetchGema,
        error: errorFetchGema,
        refetch: refetchGema,
        silentRefetch: silentRefetchGema,
    } = useFetchData<GemaTypeDetail>(`/gema/${id}`);

    console.log(gema);

    useSilentRefetch(silentRefetchGema);

    const [replyToGema, setReplyToGema] = useState<GemaType | null>(null);
    const { toasts, showToast } = useToast();

    const handleSubmitReply = async (text: string) => {
        await handleReply({
            text: text,
            parentId: gema?.id,
            refetchFn: refetchGema,
            showToast: showToast,
            onSuccess: () => setReplyToGema(null),
        });
    };

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
                <div className="w-12 h-12 rounded-full overflow-hidden">
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

                    {/* Media */}
                    {gema.media?.[0] && (
                        <div className="mt-4 rounded-xl overflow-hidden border">
                            <Image
                                src={gema.media[0].url}
                                alt="Post image"
                                width={600}
                                height={400}
                                className="w-full object-cover"
                            />
                        </div>
                    )}

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

                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faHeart} className="text-lg" />
                    <span>{gema.likesCount}</span>
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
                <ReplyModal
                    isOpen={true}
                    gema={replyToGema}
                    onClose={() => setReplyToGema(null)}
                    onSubmitReply={handleSubmitReply}
                />
            )}
        </div>
    );
}
