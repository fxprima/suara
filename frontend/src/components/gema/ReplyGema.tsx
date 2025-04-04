import { faComment, faHeart, faRetweet } from '@fortawesome/free-solid-svg-icons';
import { GemaType, ReplyType } from '../../../types/gema';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useToast } from '@/hooks/ui/useToast';
import { handleReply } from '@/utils/handeReply';
import { ReplyModal } from './ReplyModal';
import { ToastMessage } from '../common/toast/ToastMessage';

interface ReplyGemaProps {
    reply: ReplyType;
    level?: number;
    refetchGema?: () => void;
}

const MAX_LEVEL = 0;

export default function ReplyGema({ reply, level = 0, refetchGema }: ReplyGemaProps) {
    const [showChildren, setShowChildren] = useState(false);
    const canShowReplies = level < MAX_LEVEL;

    const [replyToGema, setReplyToGema] = useState<GemaType | null>(null);
    const { toasts, showToast } = useToast();

    const handleSubmitReply = async (text: string) => {
        await handleReply({
            text: text,
            parentId: reply?.id,
            refetchFn: refetchGema ?? (() => {}),
            showToast: showToast,
            onSuccess: () => setReplyToGema(null),
        });
    };

    return (
        <div className="my-4">
            <ToastMessage toasts={toasts} />
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                        src={reply.author.avatar || '/default-avatar.svg'}
                        alt="avatar"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex-1">
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

                    <div className="flex gap-6 text-sm text-gray-500 mt-2 pl-1">
                        <span
                            className="flex items-center gap-2 hover:text-primary cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                setReplyToGema(reply as GemaType);
                            }}
                        >
                            <FontAwesomeIcon icon={faComment} />
                        </span>
                        <span className="hover:text-green-500 cursor-pointer">
                            <FontAwesomeIcon icon={faRetweet} />
                        </span>
                        <span className="hover:text-pink-500 cursor-pointer">
                            <FontAwesomeIcon icon={faHeart} />
                        </span>
                    </div>
                </div>
            </div>

            {/* Sub-replies (rekursif), dikasih garis + indentation */}
            {reply.replies && reply.replies.length > 0 && (
                <div className="ml-7 border-l border-gray-600 pl-4 mt-2">
                    {canShowReplies ? (
                        // Kita tampilkan subreplies bila level masih < MAX_LEVEL
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
                <ReplyModal
                    isOpen={true}
                    gema={replyToGema as GemaType}
                    onClose={() => setReplyToGema(null)}
                    onSubmitReply={handleSubmitReply}
                />
            )}
        </div>
    );
}
