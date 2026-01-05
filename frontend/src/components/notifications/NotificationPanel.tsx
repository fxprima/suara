'use client';

import React, { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';
import { NotificationItem } from '../../../types/notifications/NotificationType';
import NotificationCard from './NotificationCard';

type TabKey = 'all' | 'following' | 'archived';

const MOCK_NOTIFS: NotificationItem[] = [
    {
        id: '1',
        type: 'follow_request',
        actor: { name: 'Sandra Marx', username: 'sandra', avatar: null },
        createdAtText: '12h',
        isRead: false,
        title: 'requested to follow you',
        subtitle: 'Follow request',
    },
    {
        id: '2',
        type: 'mention',
        actor: { name: 'Jess Radlon', username: 'jess', avatar: null },
        createdAtText: '1d',
        isRead: false,
        title: 'mentioned you in a post',
        meta: { postSnippet: '“Fel, ini beneran lucu sih 😭 cek deh…”' },
    },
    {
        id: '3',
        type: 'repost',
        actor: { name: 'Ralpg Turner', username: 'ralpg', avatar: null },
        createdAtText: '2d',
        isRead: true,
        title: 'reposted your Gema',
        meta: { postSnippet: '“Suara itu Twitter lokal yang beneran niat.”' },
    },
    {
        id: '4',
        type: 'reply',
        actor: { name: 'Adam Smith', username: 'adam', avatar: null },
        createdAtText: '3d',
        isRead: true,
        title: 'replied to your post',
        meta: { postSnippet: '“Boleh share arsitekturnya? Next + Nest + Prisma?”' },
    },
    {
        id: '5',
        type: 'system',
        createdAtText: '5d',
        isRead: true,
        title: 'Security alert: New login detected',
        subtitle: 'If this wasn’t you, change your password.',
    },
];

export default function NotificationsPanel({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const [tab, setTab] = useState<TabKey>('all');

    const filtered = useMemo(() => {
        if (tab === 'all') return MOCK_NOTIFS;
        if (tab === 'following') {
            return MOCK_NOTIFS.filter((n) => n.type === 'follow' || n.type === 'follow_request');
        }
        return MOCK_NOTIFS.filter((n) => n.isRead);
    }, [tab]);

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
                                    alert('Mock: mark all as read');
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
                                <span className="badge badge-sm ml-2">{MOCK_NOTIFS.length}</span>
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

                        {filtered.length === 0 ? (
                            <div className="text-center opacity-60 text-sm py-8">
                                No notifications here.
                            </div>
                        ) : null}
                    </div>
                </div>
            </aside>
        </>
    );
}
