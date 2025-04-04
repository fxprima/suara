'use client';
import { useState } from 'react';
import { GemaType } from '../../../types/gema';
import useAuth from '@/hooks/auth/useAuth';

interface ReplyModalProps {
    isOpen: boolean;
    onClose: () => void;
    gema: GemaType;
    onSubmitReply: (text: string) => void;
}

export const ReplyModal: React.FC<ReplyModalProps> = ({ isOpen, onClose, gema, onSubmitReply }) => {
    const [text, setText] = useState('');
    const { user } = useAuth();

    if (!isOpen) return null;

    return (
        <dialog className="modal backdrop-blur-sm" open={isOpen}>
            <div className="modal-box w-full max-w-2xl bg-base-200 rounded-xl p-6">
                {/* Close Button */}
                <form method="dialog">
                    <button
                        onClick={onClose}
                        className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
                    >
                        ✕
                    </button>
                </form>

                {/* Gema yang di-reply */}
                <div className="flex items-start space-x-3 mb-4">
                    <div className="avatar">
                        <div className="w-10 rounded-full">
                            <img src={gema.author.image ?? '/default-avatar.svg'} alt="avatar" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center space-x-2">
                            <p className="font-semibold">
                                {gema.author.firstname} {gema.author.lastname}
                            </p>
                            <p className="text-xs text-gray-500">
                                @{gema.author.username} ·{' '}
                                {new Date(gema.createdAt).toLocaleTimeString()}
                            </p>
                        </div>
                        <p className="text-sm mt-1 whitespace-pre-wrap">{gema.content}</p>
                    </div>
                </div>

                {/* Baris penanda reply */}
                <div className="pl-12 text-sm text-gray-500 mb-3">
                    Echoing <span className="text-primary">@{gema.author.username}</span>
                </div>

                {/* Area untuk reply */}
                <div className="flex items-start space-x-3">
                    <div className="avatar">
                        <div className="w-10 rounded-full">
                            <img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTBA57d__PXonmFyFDla6f2WRtfPvP9an3YA&s" // tambahin avatar
                                alt="avatar"
                            />
                        </div>
                    </div>
                    <textarea
                        className="textarea textarea-bordered w-full"
                        placeholder="Add your reply..."
                        rows={3}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>

                {/* Tombol aksi */}
                <div className="text-right mt-4">
                    <button
                        className="btn btn-primary"
                        disabled={!text.trim()}
                        onClick={() => {
                            onSubmitReply(text.trim());
                            setText('');
                            onClose();
                        }}
                    >
                        Reply
                    </button>
                </div>
            </div>
        </dialog>
    );
};
