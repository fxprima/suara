// src/components/common/media/GemaMediaGrid.tsx
'use client';
import React, { useEffect, useMemo, useRef } from 'react';

export type MediaFile = { type: 'image' | 'video'; url: string };

type Props = {
    /**
     * Bisa berupa:
     * - MediaFile[]
     * - MediaFile (single object)
     * - string[] (URL)
     * - string   (URL)
     * - undefined/null
     */
    media?: unknown;
    className?: string;
    /** Kalau mau buka lightbox/preview dari parent */
    onOpenPreview?: (index: number) => void;
    /** Matikan autoplay + observer kalau mau sederhana */
    enableAutoplay?: boolean;
    /** Tampilkan badge "Video" di pojok */
    showVideoBadge?: boolean;
};

/** Deteksi type dari URL (fallback kalau backend kirim string) */
function guessTypeFromUrl(url: string): 'image' | 'video' {
    const u = url.toLowerCase().split('?')[0];
    const img = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'];
    const vid = ['.mp4', '.webm', '.ogg', '.mov', '.m4v'];
    if (img.some((e) => u.endsWith(e))) return 'image';
    if (vid.some((e) => u.endsWith(e))) return 'video';
    // default aman: image
    return 'image';
}

/** Normalisasi ke MediaFile[] supaya aman dipakai .map() / .slice() */
function normalizeMedia(input: unknown): MediaFile[] {
    if (!input) return [];

    // Kalau sudah array, pastikan isinya MediaFile/string
    if (Array.isArray(input)) {
        return input
            .map((it: any) => {
                if (!it) return null;
                // Bentuk {type,url}
                if (typeof it === 'object' && 'url' in it) {
                    const url = String((it as any).url);
                    const type =
                        (it as any).type === 'video' || (it as any).type === 'image'
                            ? (it as any).type
                            : guessTypeFromUrl(url);
                    return { url, type } as MediaFile;
                }
                // Bentuk string URL
                if (typeof it === 'string') {
                    return { url: it, type: guessTypeFromUrl(it) } as MediaFile;
                }
                return null;
            })
            .filter(Boolean) as MediaFile[];
    }

    // Kalau single object
    if (typeof input === 'object') {
        const anyObj = input as any;
        if (anyObj && 'url' in anyObj) {
            const url = String(anyObj.url);
            const type =
                anyObj.type === 'video' || anyObj.type === 'image'
                    ? anyObj.type
                    : guessTypeFromUrl(url);
            return [{ url, type }];
        }
    }

    // Kalau single string
    if (typeof input === 'string') {
        return [{ url: input, type: guessTypeFromUrl(input) }];
    }

    return [];
}

export default function GemaMediaGrid({
    media,
    className = '',
    onOpenPreview,
    enableAutoplay = true,
    showVideoBadge = true,
}: Props) {
    const items = useMemo(() => normalizeMedia(media), [media]);
    if (items.length === 0) return null;

    const videoRefs = useRef<HTMLVideoElement[]>([]);
    const attachRef = (idx: number) => (el: HTMLVideoElement | null) => {
        if (el) videoRefs.current[idx] = el;
    };

    useEffect(() => {
        if (!enableAutoplay) return;

        const iosInline = (v: HTMLVideoElement) => {
            v.setAttribute('playsinline', 'true');
            v.setAttribute('webkit-playsinline', 'true');
        };

        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    const v = e.target as HTMLVideoElement;
                    if (e.isIntersecting) {
                        // pause video lain
                        videoRefs.current.forEach((o) => {
                            if (o && o !== v) o.pause();
                        });
                        v.play().catch(() => {});
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
    }, [items.length, enableAutoplay]);

    const handleOpen = (e: React.MouseEvent, index: number) => {
        if (!onOpenPreview) return;
        e.stopPropagation();
        onOpenPreview(index);
    };

    const Tile = (item: MediaFile, idx: number, extraClass = '') => (
        <div
            key={idx}
            className={`relative overflow-hidden rounded-xl ${extraClass} ${
                onOpenPreview ? 'cursor-pointer' : ''
            }`}
            onClick={(e) => onOpenPreview && handleOpen(e, idx)}
        >
            {item.type === 'image' ? (
                <img
                    src={item.url}
                    alt={`media-${idx}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
            ) : (
                <div className="relative w-full h-full">
                    <video
                        ref={attachRef(idx)}
                        className="w-full h-full object-cover"
                        preload="metadata"
                        muted
                        loop
                        autoPlay
                        playsInline
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                    >
                        <source src={item.url} />
                    </video>
                    {showVideoBadge && (
                        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-md px-2 py-1 text-xs bg-black/60 text-white">
                            <span aria-hidden>▶</span>
                            <span>Video</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    // ---- Layout rules (1–4) ----
    if (items.length === 1) {
        return <div className={`mt-4 ${className}`}>{Tile(items[0], 0, 'aspect-video')}</div>;
    }

    if (items.length === 2) {
        return (
            <div className={`mt-4 grid grid-cols-2 gap-2 ${className}`}>
                {Tile(items[0], 0, 'aspect-[4/3]')}
                {Tile(items[1], 1, 'aspect-[4/3]')}
            </div>
        );
    }

    if (items.length === 3) {
        return (
            <div className={`mt-4 grid grid-cols-2 gap-2 ${className}`}>
                {Tile(items[0], 0, 'aspect-[3/4] md:aspect-[4/5]')}
                <div className="grid grid-rows-2 gap-2">
                    {Tile(items[1], 1, 'aspect-square')}
                    {Tile(items[2], 2, 'aspect-square')}
                </div>
            </div>
        );
    }

    // ≥ 4 → pakai 4 pertama
    return (
        <div className={`mt-4 grid grid-cols-2 gap-2 ${className}`}>
            {items.slice(0, 4).map((m, i) => Tile(m, i, 'aspect-square'))}
        </div>
    );
}
