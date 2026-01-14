'use client';

import React from 'react';
import { NotificationItem, NotificationType } from '../../../types/notifications/NotificationType';
import { timeAgoShort } from '@/utils/time';


function typeBadge(type: NotificationType) {
    switch (type) {
        case 'FOLLOW_REQUEST':
            return { label: 'FR', className: 'badge badge-warning' };
        case 'FOLLOW':
            return { label: 'F', className: 'badge badge-success' };
        case 'MENTION':
            return { label: '@', className: 'badge badge-info' };
        case 'REPLY':
            return { label: '↩', className: 'badge badge-info' };
        case 'REPOST':
            return { label: 'RT', className: 'badge badge-primary' };
        case 'LIKE':
            return { label: '♥', className: 'badge badge-error' };
        case 'SYSTEM':
        default:
            return { label: '!', className: 'badge badge-neutral' };
    }
}

export default function NotificationCard({
    item,
    onAccept,
    onDecline,
    onOpen,
}: {
    item: NotificationItem;
    onAccept?: (id: string) => void;
    onDecline?: (id: string) => void;
    onOpen?: (id: string) => void;
}) {
    const badge = typeBadge(item.type);

    const showActions = item.type === 'FOLLOW_REQUEST';

    return (
        <div
            className={[
                'card bg-base-100 border border-base-300 rounded-xl relative',
                item.isRead ? 'opacity-80' : '',
            ].join(' ')}
        >
            <button
                type="button"
                onClick={() => onOpen?.(item.id)}
                className="card-body p-3 text-left hover:bg-base-200/40 transition rounded-xl"
            >

                <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center gap-2">
                        <div className={badge.className}>{badge.label}</div>

                        <div className="avatar">
                            <div className="w-9 rounded-full bg-base-300">
                                {item.actor?.avatar ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={item.actor.avatar} alt="avatar" />
                                ) : (
                                    <div className="w-9 h-9 flex items-center justify-center text-xs opacity-60">
                                        {item.actor?.name?.slice(0, 2)?.toUpperCase() ?? 'SU'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold truncate">
                                {item.actor ? item.actor.name : 'System'}
                                {item.actor?.username ? (
                                    <span className="ml-2 text-sm opacity-60 font-normal">
                                        @{item.actor.username}
                                    </span>
                                ) : null}
                            </p>

                            {!item.isRead && (
                                <span
                                    className="w-2.5 h-2.5 rounded-full bg-primary"
                                    title="Unread"
                                />
                            )}
                            <span className="text-xs opacity-60 whitespace-nowrap">
                                {timeAgoShort(item.createdAt)}
                            </span>
                        </div>

                        <p className="text-sm mt-1">{item.message}</p>

                        {item.meta?.subMessage ? (
                            <p className="text-xs opacity-70 mt-1">{item.meta?.subMessage}</p>
                        ) : null}

                        {item.meta?.postSnippet ? (
                            <div className="mt-2 text-xs opacity-70 bg-base-200/50 p-2 rounded-lg">
                                {`“${item.meta.postSnippet}“`}
                            </div>
                        ) : null}

                        {item.meta?.media ? (
                            <div className="mt-2">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={item.meta.media}
                                    alt="notification media"
                                    className="w-full max-h-72 object-cover rounded-lg border border-base-300"
                                    loading="lazy"
                                />
                            </div>
                        ) : null}

                        {item.meta?.fileName ? (
                            <div className="mt-2 text-xs opacity-70">
                                📎 {item.meta.fileName}
                            </div>
                        ) : null}

                        {showActions ? (
                            <div className="mt-3 flex gap-2">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAccept?.(item.id);
                                    }}
                                >
                                    Accept
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-ghost"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDecline?.(item.id);
                                    }}
                                >
                                    Decline
                                </button>
                            </div>
                        ) : null}
                    </div>
                </div>
            </button>
        </div>
    );
}
