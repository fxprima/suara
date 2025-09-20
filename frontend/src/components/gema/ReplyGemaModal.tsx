'use client';
import { useState } from 'react';
import { GemaType } from '../../../types/gema';
import MediaPicker from '@/components/common/media/MediaPicker';

interface ReplyModalProps {
    isOpen: boolean;
    onClose: () => void;
    gema: GemaType;
    onSubmitReply: (text: string) => void;
    showToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ReplyGemaModal: React.FC<ReplyModalProps> = ({
    isOpen,
    onClose,
    gema,
    onSubmitReply,
    showToast,
}) => {
    const [text, setText] = useState('');
    const [files, setFiles] = useState<File[]>([]);

    if (!isOpen) return null;

    const canSubmit = text.trim().length > 0 || files.length > 0;

    const submit = () => {
        if (!canSubmit) return;

        const formData = new FormData();
        formData.append('content', text.trim());
        files.forEach((file) => formData.append('media', file));

        onSubmitReply(formData.get('content') as string);
        setText('');
        setFiles([]);
        onClose();
    };

    return (
        <dialog className="modal backdrop-blur-sm" open={isOpen}>
            <div className="modal-box w-full max-w-2xl bg-base-200 rounded-xl p-6">
                {/* Close Button */}
                <form method="dialog">
                    <button
                        onClick={onClose}
                        className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </form>

                {/* Gema yang di-reply */}
                <div className="flex items-start space-x-3 mb-4">
                    <div className="avatar">
                        <div className="w-10 rounded-full">
                            <img src={gema.author.avatar ?? '/default-avatar.svg'} alt="avatar" />
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
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTBA57d__PXonmFyFDla6f2WRtfPvP9an3YA&s"
                                alt="avatar"
                            />
                        </div>
                    </div>
                    <div className="flex-1">
                        <textarea
                            className="textarea textarea-bordered w-full"
                            placeholder="Add your reply..."
                            rows={3}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />

                        {/* Media picker untuk reply */}
                        <MediaPicker
                            files={files}
                            onChange={setFiles}
                            max={4}
                            showToast={showToast}
                            className="mt-2"
                        />
                    </div>
                </div>

                {/* Tombol aksi */}
                <div className="text-right mt-4">
                    <button
                        className="btn btn-primary"
                        disabled={!canSubmit}
                        onClick={submit}
                        type="button"
                    >
                        Reply
                    </button>
                </div>
            </div>
        </dialog>
    );
};
