'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHeart,
    faComment,
    faRetweet,
    faChartLine,
    faBookmark,
    faShare,
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import MediaPreviewModal from '../common/media/MediaPreviewModal';
import GemaMediaGrid from '../common/media/GemaMediaGrid';

interface MediaFile {
    type: 'image' | 'video';
    url: string;
}

interface GemaCardProps {
    id: string;
    authorName: string;
    username: string;
    avatar?: string;
    content: string;
    media?: MediaFile[];
    createdAt?: string;
    viewsCount?: number;
    likesCount?: number;
    repliesCount?: number;
    onReply?: () => void;
}

/**
 * GemaCard - Komponen UI untuk menampilkan 1 post Gema ala Twitter/X style.
 *
 * Props:
 * @param {string} id - ID Gema.
 * @param {string} authorName - Nama penulis Gema
 * @param {string} username - Username penulis (tanpa '@', akan ditampilkan otomatis)
 * @param {string} [avatar] - URL avatar user (default ke `/default-avatar.png` jika tidak ada)
 * @param {string} content - Konten teks Gema
 * @param {MediaFile[]} [media] - Optional array media (image/video), max 4 file
 * @param {string} [createdAt] - Tanggal pembuatan Gema (ISO string)
 * @param {number} [viewsCount=0] - Jumlah view
 * @param {number} [likesCount=0] - Jumlah like
 * @param {number} [repliesCount=0] - Jumlah reply
 *
 * 📦 Contoh penggunaan:
 * <GemaCard
 *   id = "uiiauiiai"
 *   authorName="Felix"
 *   username="felixdev"
 *   avatar="https://..."
 *   content="Halo dunia!"
 *   media=[{ type: 'image', url: 'https://...' }]
 *   createdAt="2025-04-02T10:00:00Z"
 *   viewsCount={100}
 *   likesCount={20}
 *   repliesCount={5}
 * />
 */
export const GemaCard: React.FC<GemaCardProps> = ({
    id,
    authorName,
    username,
    avatar,
    content,
    media = [],
    createdAt,
    viewsCount = 0,
    likesCount = 0,
    repliesCount = 0,
    onReply,
}) => {
    const router = useRouter();

    const videoRefs = React.useRef<HTMLVideoElement[]>([]);

    const [preview, setPreview] = React.useState({ open: false, index: 0 });

    React.useEffect(() => {
        const iosInline = (v: HTMLVideoElement) => {
            // jaga-jaga iOS
            v.setAttribute('playsinline', 'true');
            v.setAttribute('webkit-playsinline', 'true');
        };

        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    const v = e.target as HTMLVideoElement;
                    if (e.isIntersecting) {
                        // pause semua video lain
                        videoRefs.current.forEach((o) => {
                            if (o && o !== v) o.pause();
                        });
                        v.play().catch(() => {
                            /* ignore */
                        });
                    } else {
                        v.pause();
                    }
                });
            },
            { threshold: 0.5 }
        );

        videoRefs.current.forEach((v) => {
            if (!v) return;
            iosInline(v);
            obs.observe(v);
        });

        return () => obs.disconnect();
    }, []);

    return (
        <div
            className="border-b border-base-300 pb-4 pt-2 px-1 transition duration-150 ease-in-out 
             hover:bg-base-100 hover:shadow-sm cursor-pointer rounded-xl"
            onClick={() => router.push(`/${username}/gema/${id}`)}
        >
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
                            <p className="font-semibold leading-none mb-2">{authorName}</p>
                            <p className="text-sm text-gray-500 leading-none">@{username}</p>
                        </div>
                        {createdAt && (
                            <span className="text-xs text-gray-400">
                                {new Date(createdAt).toLocaleDateString('id-ID', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: '2-digit',
                                })}
                            </span>
                        )}
                    </div>
                    {/* Content */}
                    <div className="mt-2 whitespace-pre-wrap text-base">{content}</div>

                    {/* Media */}
                    <GemaMediaGrid
                        media={media}
                        className="mt-3"
                        onOpenPreview={(index) => setPreview({ open: true, index })}
                    />

                    <MediaPreviewModal
                        open={preview.open}
                        items={media}
                        initialIndex={preview.index}
                        onClose={() => setPreview((p) => ({ ...p, open: false }))}
                    />

                    {/* Engagement */}
                    <div className="flex justify-between text-sm text-gray-500 mt-3 px-2 text-center">
                        <div
                            className="flex items-center space-x-1 hover:text-primary cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                onReply?.();
                            }}
                        >
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
