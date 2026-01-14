'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';
import { NotificationItem, NotificationResponse, NotificationType } from '../../../types/notifications/NotificationType';
import NotificationCard from './NotificationCard';
import api from '@/services/api';
import useAuth from '@/hooks/auth/useAuth';
import { extractErrorMessage } from '@/utils/handleApiError';
import { useToast } from '@/hooks/ui/useToast';

type TabKey = 'all' | 'following' | 'archived';


export default function NotificationsPanel({
    open,
    onClose,
    liveItem,
    onMarkedRead,
    
}: {
    open: boolean;
    onClose: () => void;
    liveItem?: NotificationItem | null;
    onMarkedRead?: (countMarked: number) => void;
}) {
    const { user } = useAuth();
    const { toasts, showToast } = useToast();
    const [tab, setTab] = useState<TabKey>('all');

    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasNext, setHasNext] = useState<boolean>(true);
    const [loading, setLoading] = useState({
        initialFetch: false,
        loadingNext: false
    })

    const inFlightRef = useRef(false);

    const fetchConnections = useCallback(
        async (opts?: { cursor?: string | null; append?: boolean }) => {
            if (!user?.id || inFlightRef.current) return;

            inFlightRef.current = true;

            const append = opts?.append ?? false;
            const cursor = opts?.cursor ?? null;

            try {
                if (!append)
                    setLoading((p) => ({ ...p, initialFetch: true }));
                else
                    setLoading((p) => ({ ...p, loadingNext: true }))

                const res = await api.get<NotificationResponse>(
                    `/notification/${user?.id}`,
                    {
                        params: {
                            limit: 5,
                            ...(cursor ? { cursor } : {}),
                        },
                        withCredentials: true,
                    }
                );


                const payload = res.data;
                const newItems = payload?.data ?? [];

                setHasNext(Boolean(payload?.hasNext));
                setNextCursor(payload?.nextCursor ?? null);

                setNotifications((prev) => {
                    if (!append) return newItems;

                    const merged = [...prev, ...newItems];
                    const map = new Map<string, NotificationItem>();

                    for (const g of merged) map.set(g.id, g);

                    return Array.from(map.values());
                })



            } catch (err) {
                console.error('[fetchFeed]', err);
                showToast(extractErrorMessage(err), 'error');
            } finally {
                if (!append)
                    setLoading((p) => ({ ...p, initialFetch: false }));
                else
                    setLoading((p) => ({ ...p, loadingNext: false }))

                inFlightRef.current = false;
            }
        },
        [user?.id, showToast]
    )


    const resetAndReload = useCallback(async () => {
        setNotifications([]);
        setNextCursor(null);
        setHasNext(true);
        await fetchConnections({ cursor: null, append: false });
    }, [fetchConnections]);

    useEffect(() => {
        resetAndReload();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    useEffect(() => {
        if (!liveItem) return;

        setNotifications((prev) => {
            if (prev.some((x) => x.id === liveItem.id)) return prev;
            return [liveItem, ...prev];
        });
    }, [liveItem]);


    
    const handleLoadMore = async () => {
        if (!hasNext || !nextCursor) return;

        await fetchConnections({ cursor: nextCursor, append: true });
    };

    const filtered = useMemo(() => {
        if (tab === 'all') return notifications;

        if (tab === 'following') {
            return notifications.filter(
                (n) => n.type === 'FOLLOW' || n.type === 'FOLLOW_REQUEST'
            );
        }

        return notifications.filter((n) => n.isRead);
    }, [tab, notifications]);

    const markFetchedAsRead = useCallback(async () => {
        if (!notifications.length) return;

        const ids = notifications.filter((n) => !n.isRead).map((n) => n.id);
        if (ids.length === 0) return;
        setNotifications((prev) => prev.map((n) => (ids.includes(n.id) ? { ...n, isRead: true } : n)));
        onMarkedRead?.(ids.length);


        try {
            await api.post(
                `/notification/read`,
                { notificationIds: ids },
                { withCredentials: true }
            );
        } catch (err) {
            setNotifications((prev) => prev.map((n) => (ids.includes(n.id) ? { ...n, isRead: false } : n)));
            showToast(extractErrorMessage(err), 'error');
        }
    }, [notifications, showToast]);

    useEffect(() => {
    if (!open) return;

    markFetchedAsRead();
    }, [open, markFetchedAsRead]);


    if (!open) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/30 z-40"
                onClick={onClose}
                aria-hidden="true"
            />

            <aside
                className={[
                    'fixed z-50 bg-base-300 border border-base-300 shadow-xl',
                    'w-full sm:w-[420px]',
                    'top-8 bottom-8',
                    'rounded-2xl overflow-hidden',
                    'left-0 lg:left-[20%]',
                ].join(' ')}
                role="dialog"
                aria-modal="true"
            >

                <div className="h-full flex flex-col">
                    {/* header */}
                    <div className="p-4 border-b border-base-300 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold">Notifications</h2>
                            <p className="text-xs opacity-60">Stay updated with Suara</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="btn btn-sm btn-ghost"
                                title="Mark all as read"
                                onClick={() => {
                                    markFetchedAsRead();
                                }}

                            >
                                <FontAwesomeIcon icon={faCheck} className="h-4 w-4" />
                            </button>

                            <button
                                type="button"
                                className="btn btn-sm btn-ghost"
                                onClick={onClose}
                                title="Close"
                            >
                                <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* tabs */}
                    <div className="px-4 pt-3">
                        <div className="tabs tabs-bordered">
                            <button
                                className={`tab ${tab === 'all' ? 'tab-active' : ''}`}
                                onClick={() => setTab('all')}
                                type="button"
                            >
                                All
                                <span className="badge badge-sm ml-2">{notifications.length}</span>
                            </button>
                            <button
                                className={`tab ${tab === 'following' ? 'tab-active' : ''}`}
                                onClick={() => setTab('following')}
                                type="button"
                            >
                                Following
                            </button>
                            <button
                                className={`tab ${tab === 'archived' ? 'tab-active' : ''}`}
                                onClick={() => setTab('archived')}
                                type="button"
                            >
                                Archived
                            </button>
                        </div>
                    </div>

                    {/* list */}
                    <div className="px-4 py-3 pb-8 overflow-y-auto flex-1 space-y-4">

                        {filtered.map((item) => (
                            <NotificationCard
                                key={item.id}
                                item={item}
                                onOpen={(id) => {
                                    // eslint-disable-next-line no-alert
                                    alert(`Mock open notification ${id}`);
                                }}
                                onAccept={(id) => {
                                    // eslint-disable-next-line no-alert
                                    alert(`Mock accept follow request ${id}`);
                                }}
                                onDecline={(id) => {
                                    // eslint-disable-next-line no-alert
                                    alert(`Mock decline follow request ${id}`);
                                }}
                            />
                        ))}

                        {hasNext ? (
                            <div className="flex justify-center pt-2">
                                <button
                                    type="button"
                                    onClick={handleLoadMore}
                                    className="btn btn-primary flex items-center"
                                    disabled={loading.loadingNext || loading.initialFetch}
                                >
                                    {(loading.loadingNext || loading.initialFetch) && (
                                        <span className="loading loading-spinner loading-sm" />
                                    )}
                                    {loading.loadingNext ? 'Loading...' : 'Load More'}
                                </button>
                            </div>
                        ) : (
                            filtered.length > 0 && (
                                <p className="text-center text-sm opacity-60">End of feed 🙂</p>
                            )
                        )}
                    </div>
                </div>


            </aside>
        </>
    );
}
