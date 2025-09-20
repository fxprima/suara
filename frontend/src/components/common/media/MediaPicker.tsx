'use client';

import { useRef, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faTimes } from '@fortawesome/free-solid-svg-icons';

type ToastFn = (msg: string, type?: 'success' | 'error' | 'info') => void;

interface MediaPickerProps {
    /** Controlled: daftar file terpilih */
    files: File[];
    /** Setter dari parent (controlled) */
    onChange: (files: File[]) => void;
    /** Maksimal file (default 4) */
    max?: number;
    /** Opsional: showToast dari app */
    showToast?: ToastFn;
    /** Kelas tambahan wrapper jika perlu */
    className?: string;
}

export default function MediaPicker({
    files,
    onChange,
    max = 4,
    showToast,
    className,
}: MediaPickerProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const isImage = (f: File) => f.type.startsWith('image/');
    const isVideo = (f: File) => f.type.startsWith('video/');

    const objectUrls = useMemo(
        () => files.map((f) => ({ name: f.name, url: URL.createObjectURL(f) })),
        [files]
    );

    useEffect(() => {
        // cleanup object URLs saat files berubah/unmount
        return () => {
            objectUrls.forEach(({ url }) => URL.revokeObjectURL(url));
        };
    }, [objectUrls]);

    const handleSelectMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
        const picked = Array.from(e.target.files ?? []);
        if (!picked.length) return;

        const total = files.length + picked.length;
        if (total > max) {
            showToast?.(`Maximum ${max} media files allowed`, 'error');
            e.target.value = '';
            return;
        }

        const valid = picked.filter((f) => isImage(f) || isVideo(f));
        if (valid.length !== picked.length) {
            showToast?.('Only images or videos are allowed', 'error');
        }

        onChange([...files, ...valid]);
        e.target.value = '';
    };

    const removeAt = (idx: number) => {
        const next = [...files];
        next.splice(idx, 1);
        onChange(next);
    };

    const clearAll = () => onChange([]);

    return (
        <div className={className}>
            {/* Preview grid */}
            {files.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                    {files.map((file, i) => {
                        const url = objectUrls[i]?.url;
                        return (
                            <div key={`${file.name}-${i}`} className="relative w-full h-32 md:h-40">
                                {isImage(file) ? (
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
                                        playsInline
                                    />
                                )}

                                <button
                                    onClick={() => removeAt(i)}
                                    className="absolute -top-2 -right-2 bg-base-100 rounded-full p-1 text-xs"
                                    title="Remove file"
                                    aria-label="Remove file"
                                    type="button"
                                >
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Picker row */}
            <div className="flex items-center mt-3">
                <FontAwesomeIcon
                    icon={faImage}
                    className="h-5 w-5 opacity-50 cursor-pointer hover:text-primary"
                    onClick={() => fileInputRef.current?.click()}
                />
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    onChange={handleSelectMedia}
                    title="Choose images or videos to upload"
                />
                <span className="ml-2 text-xs opacity-60">
                    {files.length}/{max}
                </span>

                {files.length > 0 && (
                    <button
                        type="button"
                        onClick={clearAll}
                        className="btn btn-ghost btn-xs ml-3"
                        title="Clear all"
                    >
                        Clear
                    </button>
                )}
            </div>
        </div>
    );
}
