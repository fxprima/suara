'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEye,
    faHeart,
    faComment,
    faRetweet,
    faChartLine,
    faBookmark,
    faShare,
} from '@fortawesome/free-solid-svg-icons';

interface MediaFile {
    type: 'image' | 'video';
    url: string;
}

interface GemaCardProps {
    authorName: string;
    username: string;
    avatar?: string;
    content: string;
    media?: MediaFile[];
    createdAt?: string;
    viewsCount?: number;
    likesCount?: number;
    repliesCount?: number;
}

export const GemaCard: React.FC<GemaCardProps> = ({
    authorName,
    username,
    avatar,
    content,
    media = [],
    createdAt,
    viewsCount = 0,
    likesCount = 0,
    repliesCount = 0,
}) => {
    return (
        <div className="border-b border-base-300 pb-4 pt-2 px-1">
            {/* Header */}
            <div className="flex items-start space-x-3">
                <div className="avatar">
                    <div className="w-10 rounded-full">
                        <img src={avatar || '/default-avatar.png'} alt="avatar" />
                    </div>
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold leading-none">{authorName}</p>
                            <p className="text-sm text-gray-500 leading-none">@{username}</p>
                        </div>
                        {createdAt && (
                            <span className="text-xs text-gray-400">
                                {new Date(createdAt).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                    {/* Content */}
                    <div className="mt-2 whitespace-pre-wrap text-base">{content}</div>
                    {/* Media */}
                    {media.length > 0 && (
                        <div
                            className={`grid gap-2 mt-3 ${
                                media.length === 1
                                    ? 'grid-cols-1'
                                    : media.length <= 4
                                    ? 'grid-cols-2'
                                    : 'grid-cols-3'
                            }`}
                        >
                            {media.map((item, idx) => (
                                <div key={idx} className="overflow-hidden rounded-xl max-h-80">
                                    {item.type === 'image' ? (
                                        <img
                                            src={item.url}
                                            alt={`media-${idx}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <video controls className="w-full rounded-xl">
                                            <source src={item.url} />
                                        </video>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    {/* Engagement */}
                    <div className="flex justify-between text-sm text-gray-500 mt-3 px-2 text-center">
                        <div className="flex items-center space-x-1 hover:text-primary cursor-pointer">
                            <FontAwesomeIcon icon={faComment} className="w-4 h-4" />
                            <span>{repliesCount}</span>
                        </div>
                        <div className="flex items-center space-x-1 hover:text-green-500 cursor-pointer">
                            <FontAwesomeIcon icon={faRetweet} className="w-4 h-4" />
                            <span>0</span>
                        </div>
                        <div className="flex items-center space-x-1 hover:text-pink-500 cursor-pointer">
                            <FontAwesomeIcon icon={faHeart} className="w-4 h-4" />
                            <span>{likesCount}</span>
                        </div>
                        <div className="flex items-center space-x-1 hover:text-primary cursor-pointer">
                            <FontAwesomeIcon icon={faChartLine} className="w-4 h-4" />
                            <span>{viewsCount}</span>
                        </div>
                        <div className="flex items-center space-x-1 hover:text-primary cursor-pointer">
                            <FontAwesomeIcon icon={faBookmark} className="w-4 h-4" />
                        </div>
                        <div className="flex items-center space-x-1 hover:text-primary cursor-pointer">
                            <FontAwesomeIcon icon={faShare} className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
