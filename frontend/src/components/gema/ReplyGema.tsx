import { faComment, faHeart, faRetweet } from '@fortawesome/free-solid-svg-icons';
import { ReplyType } from '../../../types/gema';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function ReplyGema({ reply }: { reply: ReplyType }) {
    return (
        <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                    src={reply.author.avatar || '/default-avatar.svg'}
                    alt="avatar"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Konten reply */}
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
                    <span className="hover:text-primary cursor-pointer">
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
    );
}
