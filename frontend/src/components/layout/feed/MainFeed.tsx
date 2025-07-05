'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFeather, faImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import api from '@/services/api';
import { useState, useRef } from 'react';
import { useAutoGrow } from '@/hooks/ui/useAutoGrow';
import { extractErrorMessage } from '@/utils/handleApiError';
import { ToastMessage } from '../../common/toast/ToastMessage';
import { useToast } from '@/hooks/ui/useToast';
import { GemaCard } from '../../gema/GemaCard';
import { useFetchData } from '@/hooks/data/useFetchData';
import { GemaType } from '../../../../types/gema';
import { ReplyGemaModal } from '../../gema/ReplyGemaModal';
import { handleReply } from '@/utils/handleReply';
import { useSilentRefetch } from '@/hooks/data/useSilentRefetch';

export default function MainFeed() {
    /* ──────────────── state ──────────────── */
    const [createGemaField, setCreateGemaField] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // ≤ 4 file
    const [replyToGema, setReplyToGema] = useState<GemaType | null>(null);
    const [loading, setLoading] = useState({ createGema: false });

    const textareaRef = useAutoGrow(createGemaField);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    /* ──────────────── data fetch ──────────────── */
    const {
        data: gemas,
        loading: loadingFetchGema,
        refetch: refetchGema,
        silentRefetch: silentRefetchGema,
    } = useFetchData<GemaType[]>('/gema');

    const { toasts, showToast } = useToast();

    useSilentRefetch(silentRefetchGema);

    /* ──────────────── helpers ──────────────── */
    const handleSelectMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (!files.length) return;

        const total = selectedFiles.length + files.length;
        if (total > 4) {
            showToast('Maximum 4 media files allowed', 'error');
            e.target.value = '';
            return;
        }

        const valid = files.filter(
            (f) => f.type.startsWith('image/') || f.type.startsWith('video/')
        );

        if (valid.length !== files.length) {
            showToast('Only images or videos are allowed', 'error');
        }

        setSelectedFiles((prev) => [...prev, ...valid]);
        e.target.value = '';
    };

    const removeFile = (idx: number) => {
        setSelectedFiles((prev) => {
            const copy = [...prev];
            URL.revokeObjectURL(URL.createObjectURL(copy[idx])); // clean object URL
            copy.splice(idx, 1);
            return copy;
        });
    };

    const clearMedia = () => {
        selectedFiles.forEach((f) => URL.revokeObjectURL(f as any));
        setSelectedFiles([]);
    };

    const handlePost = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!createGemaField.trim() && !selectedFiles.length) return;

        try {
            setLoading((p) => ({ ...p, createGema: true }));
            const formData = new FormData();
            formData.append('content', createGemaField);
            selectedFiles.forEach((file) => formData.append('media', file));

            const res = await api.post('/gema', formData, { withCredentials: true });
            console.log('Res Create Gema:', res);

            setCreateGemaField('');
            clearMedia();
            showToast('You have successfully posted your Suara!', 'success');
            refetchGema();
        } catch (err) {
            console.error(err);
            showToast(extractErrorMessage(err), 'error');
        } finally {
            setLoading((p) => ({ ...p, createGema: false }));
        }
    };

    const handleSubmitReply = async (text: string) => {
        await handleReply({
            text,
            parentId: replyToGema?.id,
            refetchFn: refetchGema,
            showToast,
            onSuccess: () => setReplyToGema(null),
        });
    };

    /* ──────────────── UI ──────────────── */
    return (
        <>
            <ToastMessage toasts={toasts} />

            {/* composer */}
            <div className="border-b border-base-300 pb-4">
                <div className="flex items-start space-x-2 mb-4">
                    <FontAwesomeIcon
                        icon={faFeather}
                        className="h-5 w-5 opacity-50 translate-y-[2px]"
                    />

                    <div className="w-full">
                        <textarea
                            ref={textareaRef}
                            placeholder="What is going on?"
                            className="textarea textarea-bordered w-full resize-none min-h-0 overflow-hidden py-2 leading-snug"
                            rows={1}
                            value={createGemaField}
                            onChange={(e) => setCreateGemaField(e.target.value)}
                        />

                        {/* media preview */}
                        {selectedFiles.length > 0 && (
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {selectedFiles.map((file, i) => {
                                    const url = URL.createObjectURL(file);
                                    const isImage = file.type.startsWith('image/');
                                    return (
                                        <div key={i} className="relative w-full h-32 md:h-40">
                                            {isImage ? (
                                                <img
                                                    src={url}
                                                    alt={file.name}
                                                    className="object-cover w-full h-full rounded-md"
                                                />
                                            ) : (
                                                <video
                                                    src={url}
                                                    className="object-cover w-full h-full rounded-md"
                                                    muted
                                                    loop
                                                />
                                            )}

                                            <button
                                                onClick={() => removeFile(i)}
                                                className="absolute -top-2 -right-2 bg-base-100 rounded-full p-1 text-xs"
                                                title="Remove file"
                                            >
                                                <FontAwesomeIcon icon={faTimes} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* media chooser */}
                        <div className="flex items-center mt-4">
                            <FontAwesomeIcon
                                icon={faImage}
                                className="h-5 w-5 opacity-50 cursor-pointer hover:text-primary"
                                onClick={() => fileInputRef.current?.click()}
                            />
                            <input
                                type="file"
                                accept="image/*,video/*"
                                multiple
                                ref={fileInputRef}
                                onChange={handleSelectMedia}
                                className="hidden"
                                title="Choose images or videos to upload"
                            />
                            <span className="ml-2 text-xs opacity-60">
                                {selectedFiles.length}/4
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={handlePost}
                    disabled={loading.createGema}
                >
                    {loading.createGema && <span className="loading loading-spinner loading-sm" />}
                    {loading.createGema ? 'Menggema...' : 'Gema'}
                </button>
            </div>

            {/* feed */}
            <div className="mt-6 space-y-4">
                {!loadingFetchGema && gemas?.length === 0 && (
                    <p className="text-center text-sm text-gray-500">
                        Gema? Gema? …Anyone? Start one!
                    </p>
                )}

                {loadingFetchGema && (
                    <div className="flex justify-center items-center py-6">
                        <span className="loading loading-spinner loading-md text-primary" />
                    </div>
                )}
                {!loadingFetchGema
                    ? gemas?.map((gema) => (
                          <GemaCard
                              id={gema.id}
                              key={gema.id}
                              authorName={`${gema.author.firstname} ${gema.author?.lastname}`}
                              username={gema.author.username}
                              avatar={gema.author.avatar ?? '/default-avatar.svg'}
                              content={gema.content}
                              media={gema.media}
                              createdAt={gema.createdAt}
                              viewsCount={gema.viewsCount}
                              likesCount={gema.likedBy.length}
                              repliesCount={gema.repliesCount}
                              onReply={() => setReplyToGema(gema)} // trigger set gema.
                          />
                      ))
                    : null}

                {replyToGema && (
                    <ReplyGemaModal
                        isOpen={true}
                        gema={replyToGema}
                        onClose={() => setReplyToGema(null)}
                        onSubmitReply={handleSubmitReply}
                    />
                )}
            </div>
        </>
    );
}
