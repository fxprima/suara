'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFeather } from '@fortawesome/free-solid-svg-icons';
import api from '@/services/api';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useAutoGrow } from '@/hooks/ui/useAutoGrow';
import { extractErrorMessage } from '@/utils/handleApiError';
import { ToastMessage } from '../../common/toast/ToastMessage';
import { useToast } from '@/hooks/ui/useToast';
import { GemaCard } from '../../gema/GemaCard';
import { GemaType } from '../../../../types/gema';
import { ReplyGemaModal } from '../../gema/ReplyGemaModal';
import { handleReply } from '@/utils/handleReply';
import MediaPicker from '@/components/common/media/MediaPicker';
import useAuth from '@/hooks/auth/useAuth';

type GemaFeedResponse = {
    data: GemaType[];
    nextCursor?: string | null;
    hasMore?: boolean;
};

const FEED_LIMIT = 5;

export default function MainFeed() {
    const { user } = useAuth();
    const { toasts, showToast } = useToast();


    const [createGemaField, setCreateGemaField] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState({ createGema: false });

    const textareaRef = useAutoGrow(createGemaField);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [gemas, setGemas] = useState<GemaType[]>([]);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const [loadingInitial, setLoadingInitial] = useState<boolean>(false);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);

    const [replyToGema, setReplyToGema] = useState<GemaType | null>(null);

    const inFlightRef = useRef(false);

    const clearMedia = () => setSelectedFiles([]);

    const bumpReplyCount = (parentId?: string) => {
        if (!parentId) return;
        setGemas(prev =>
            prev.map(g =>
                g.id === parentId
                    ? {
                        ...g,
                        repliesCount: (g.repliesCount ?? 0) + 1,
                    }
                    : g
            )
        );
    };

    const fetchFeed = useCallback(
        async (opts?: { cursor?: string | null; append?: boolean }) => {
            if (!user?.id) return;
            if (inFlightRef.current) return;

            inFlightRef.current = true;

            const append = opts?.append ?? false;
            const cursor = opts?.cursor ?? null;

            try {
                if (!append) setLoadingInitial(true);
                else setLoadingMore(true);

                const res = await api.get<GemaFeedResponse>(`/gema/${user.id}/feed`, {
                    params: {
                        limit: FEED_LIMIT,
                        ...(cursor ? { cursor } : {}),
                    },
                    withCredentials: true,
                });

                const payload = res.data;
                const newItems = payload?.data ?? [];

                setHasMore(Boolean(payload?.hasMore));
                setNextCursor(payload?.nextCursor ?? null);

                setGemas((prev) => {
                    if (!append) return newItems;

                    // append + dedupe by id
                    const merged = [...prev, ...newItems];
                    const map = new Map<string, GemaType>();
                    
                    for (const g of merged) map.set(g.id, g);

                    return Array.from(map.values());
                });
            } catch (err) {
                console.error('[fetchFeed]', err);
                showToast(extractErrorMessage(err), 'error');
            } finally {
                if (!append) setLoadingInitial(false);
                else setLoadingMore(false);
                
                inFlightRef.current = false;
            }
        },
        [user?.id, showToast]
    );

    const resetAndReload = useCallback(async () => {
        // reset feed to first page
        setGemas([]);
        setNextCursor(null);
        setHasMore(true);
        await fetchFeed({ cursor: null, append: false });
    }, [fetchFeed]);

    // initial load when user ready
    useEffect(() => {
        if (!user?.id) return;
        resetAndReload();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    const handlePost = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!createGemaField.trim() && !selectedFiles.length) return;

        try {
            setLoading((p) => ({ ...p, createGema: true }));

            const formData = new FormData();
            formData.append('content', createGemaField);
            selectedFiles.forEach((file) => formData.append('media', file));

            await api.post('/gema', formData, { withCredentials: true });

            setCreateGemaField('');
            clearMedia();
            showToast('You have successfully gema-ed your Suara!', 'success');

            await resetAndReload();
        } catch (err) {
            console.error(err);
            showToast(extractErrorMessage(err), 'error');
        } finally {
            setLoading((p) => ({ ...p, createGema: false }));
        }
    };

    const handleSubmitReply = async (formData: FormData) => {
        await handleReply({
            formData,
            parentId: replyToGema?.id,
            refetchFn: async () => {},
            showToast,
            onSuccess: () => {
                bumpReplyCount(replyToGema?.id);
                setReplyToGema(null);
            },
        });
    };

    const handleLoadMore = async () => {
        if (!hasMore || !nextCursor) return;
        
        await fetchFeed({ cursor: nextCursor, append: true });
    };

    return (
        <>
            <ToastMessage toasts={toasts} />

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

                        <MediaPicker
                            files={selectedFiles}
                            onChange={setSelectedFiles}
                            max={4}
                            showToast={showToast}
                            className="w-full"
                        />
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
                {!loadingInitial && gemas.length === 0 && (
                    <p className="text-center text-sm text-gray-500">
                        Gema? Gema? …Anyone? Start one!
                    </p>
                )}

                {loadingInitial && (
                    <div className="flex justify-center items-center py-6">
                        <span className="loading loading-spinner loading-md text-primary" />
                    </div>
                )}

                {!loadingInitial
                    ? gemas.map((gema) => (
                        <GemaCard
                            key={gema.id}
                            gema={gema}
                            onReply={() => setReplyToGema(gema)}
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

                {/* Load more */}
                <div className="flex justify-center py-4">
                    {hasMore ? (
                        <button
                            type="button"
                            onClick={handleLoadMore}
                            className="btn btn-primary"
                            disabled={loadingMore || loadingInitial}
                        >
                            {(loadingMore || loadingInitial) && (
                                <span className="loading loading-spinner loading-sm" />
                            )}
                            {loadingMore ? 'Loading...' : 'Load More'}
                        </button>
                    ) : (
                        gemas.length > 0 && (
                            <p className="text-center text-sm opacity-60">End of feed 🙂</p>
                        )
                    )}
                </div>
            </div>
        </>
    );
}
