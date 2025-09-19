'use client';

import React from 'react';
import { createPortal } from 'react-dom';

type MediaItem = { type: 'image' | 'video'; url: string };

interface MediaPreviewModalProps {
    open: boolean;
    items: MediaItem[];
    initialIndex?: number;
    onClose: () => void;
}

const MediaPreviewModal: React.FC<MediaPreviewModalProps> = ({
    open,
    items,
    initialIndex = 0,
    onClose,
}) => {
    const [idx, setIdx] = React.useState(initialIndex);
    const touchX = React.useRef<number | null>(null);

    React.useEffect(() => {
        if (!open) return;
        setIdx(initialIndex);

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') setIdx((i) => (i + 1) % items.length);
            if (e.key === 'ArrowLeft') setIdx((i) => (i - 1 + items.length) % items.length);
        };
        document.addEventListener('keydown', onKey);

        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [open, initialIndex, items.length, onClose]);

    if (!open || typeof document === 'undefined') return null;

    const goPrev = () => setIdx((i) => (i - 1 + items.length) % items.length);
    const goNext = () => setIdx((i) => (i + 1) % items.length);
    const item = items[idx];

    return createPortal(
        <div
            className="fixed inset-0 z-[999] bg-black/80 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-5xl max-h-[90vh] flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
                onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
                onTouchEnd={(e) => {
                    if (touchX.current == null) return;
                    const dx = e.changedTouches[0].clientX - touchX.current;
                    if (Math.abs(dx) > 50) dx > 0 ? goPrev() : goNext();
                    touchX.current = null;
                }}
            >
                {item.type === 'image' ? (
                    <img
                        src={item.url}
                        alt=""
                        className="max-h-[90vh] w-auto object-contain rounded-xl"
                    />
                ) : (
                    <video
                        src={item.url}
                        controls
                        autoPlay
                        playsInline
                        className="max-h-[90vh] w-auto object-contain rounded-xl"
                    />
                )}

                {/* Close */}
                <button
                    className="absolute top-2 right-2 bg-black/60 hover:bg-black text-white rounded-full p-2"
                    aria-label="Close"
                    onClick={onClose}
                >
                    ✕
                </button>

                {/* Prev / Next */}
                {items.length > 1 && (
                    <>
                        <button
                            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white rounded-full p-2"
                            aria-label="Previous"
                            onClick={goPrev}
                        >
                            ‹
                        </button>
                        <button
                            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white rounded-full p-2"
                            aria-label="Next"
                            onClick={goNext}
                        >
                            ›
                        </button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-xs bg-black/50 rounded-full px-2 py-0.5">
                            {idx + 1}/{items.length}
                        </div>
                    </>
                )}
            </div>
        </div>,
        document.body
    );
};

export default MediaPreviewModal;
