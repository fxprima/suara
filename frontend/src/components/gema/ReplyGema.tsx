import { faComment, faHeart, faRetweet } from '@fortawesome/free-solid-svg-icons';
import { GemaType, ReplyType } from '../../../types/gema';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/ui/useToast';
import { handleReply } from '@/utils/handleReply';
import { ToastMessage } from '../common/toast/ToastMessage';
import { ReplyGemaModal } from './ReplyGemaModal';
import api from '@/services/api';
import isGemaLikedByUser from '@/utils/gema';
import useAuth from '@/hooks/auth/useAuth';
import GemaMediaGrid from '../common/media/GemaMediaGrid';
import MediaPreviewModal from '../common/media/MediaPreviewModal';

interface ReplyGemaProps {
    reply: ReplyType;
    level?: number;
    refetchGema?: () => void;
}

const MAX_LEVEL = 1;

export default function ReplyGema({ reply, level = 0, refetchGema }: ReplyGemaProps) {
    const [showChildren, setShowChildren] = useState(false);
    const canShowReplies = level < MAX_LEVEL;

    const [replyToGema, setReplyToGema] = useState<GemaType | null>(null);
    const { toasts, showToast } = useToast();
    const { user: loggedUser } = useAuth();

    const [preview, setPreview] = useState({ open: false, index: 0 });

    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    useEffect(() => {
        setLikesCount(reply?.likedBy?.length ?? 0);
        if (!loggedUser?.id) {
            setIsLiked(false);
            return;
        }

        const liked = (reply?.likedBy ?? []).some((u) => u.user.id === loggedUser.id);
        setIsLiked(liked);
    }, [reply, loggedUser?.id]);

    const handleSubmitReply = async (formData: FormData) => {
        await handleReply({
            formData: formData,
            parentId: reply?.id,
            refetchFn: refetchGema ?? (() => {}),
            showToast: showToast,
            onSuccess: () => setReplyToGema(null),
        });
    };

    const handleLikeReply = async (e: React.MouseEvent, replyId: string) => {
        if (!loggedUser?.id)
            return;

        setIsLiked((prev) => !prev);
        setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
        
        try {
            await api.patch(`/gema/${replyId}/likes`, {}, { withCredentials: true });
        } catch (err) {
            setIsLiked((prev) => !prev);
            setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
        }
    };

    return (
        <div className="my-4 ">
            <ToastMessage toasts={toasts} />
            <div
                className="flex items-start gap-3 hover:bg-base-100 p-3 rounded-lg transition-colors cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `/${reply.author.username}/gema/${reply.id}`;
                }}
            >
                <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                        src={reply.author.avatar || '/default-avatar.svg'}
                        alt="avatar"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex-1 ">
                    <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">
                            {reply.author.firstname} {reply.author.lastname}
                        </p>
                        <span className="text-sm text-gray-500">@{reply.author.username}</span>
                        <span className="text-xs text-gray-500">
                            {new Date(reply.createdAt).toLocaleString('id-ID', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                            })}
                        </span>
                    </div>

                    <p className="text-base mt-1 whitespace-pre-wrap">{reply.content}</p>

                    <GemaMediaGrid
                        media={reply.media}
                        className="mt-3"
                        onOpenPreview={(index) => setPreview({ open: true, index })}
                    />

                    <MediaPreviewModal
                        open={preview.open}
                        items={reply.media ?? []}
                        initialIndex={preview.index}
                        onClose={() => setPreview((p) => ({ ...p, open: false }))}
                    />

                    <div className="flex gap-6 text-sm text-gray-500 mt-2 pl-1">
                        <div
                            className="flex items-center gap-2 group hover:text-primary cursor-pointer "
                            onClick={(e) => {
                                e.stopPropagation();
                                setReplyToGema(reply as GemaType);
                            }}
                        >
                            <FontAwesomeIcon icon={faComment} />
                            <span>{reply.replies?.length}</span>
                        </div>
                        <div className="flex items-center gap-2 group hover:text-green-500 cursor-pointer ">
                            <FontAwesomeIcon icon={faRetweet} />
                            <span>{0}</span>
                        </div>

                        <div className="flex items-center gap-2 group">
                            <FontAwesomeIcon
                                icon={faHeart}
                                className={`text-lg cursor-pointer transition-colors ${isLiked ? 'text-red-500' : 'group-hover:text-red-500'
                                    }`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleLikeReply(e, reply.id);
                                }}
                            />
                            <span>{likesCount}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sub-replies (rekursif)*/}
            {reply.replies && reply.replies.length > 0 && (
                <div className="ml-7 border-l border-gray-600 pl-4 mt-2">
                    {canShowReplies ? (
                        // tampilkan subreplies bila level masih < MAX_LEVEL
                        reply.replies.map((childReply) => (
                            <ReplyGema key={childReply.id} reply={childReply} level={level + 1} />
                        ))
                    ) : // Kalau udah mentok level, kasih button "Show Child Replies"
                    !showChildren ? (
                        <button
                            className="btn btn-link no-underline text-sm "
                            onClick={() => setShowChildren(true)}
                        >
                            Show {reply.replies.length} more{' '}
                            {reply.replies.length > 1 ? 'replies' : 'reply'}
                        </button>
                    ) : (
                        // Kalau user klik "Show more", baru render child
                        reply.replies.map((childReply) => (
                            <ReplyGema
                                key={childReply.id}
                                reply={childReply}
                                level={level + 1}
                                refetchGema={refetchGema}
                            />
                        ))
                    )}
                </div>
            )}
            {replyToGema && (
                <ReplyGemaModal
                    isOpen={true}
                    avatar={loggedUser?.avatar ?? '/default-avatar.svg'}
                    gema={replyToGema as GemaType}
                    onClose={() => setReplyToGema(null)}
                    onSubmitReply={handleSubmitReply}
                />
            )}
        </div>
    );
}
