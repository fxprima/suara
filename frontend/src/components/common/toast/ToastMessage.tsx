'use client';

import React from 'react';
import clsx from 'clsx';

export type ToastType = 'info' | 'success' | 'error' | 'warning';

export interface ToastItem {
    type: ToastType;
    message: string;
}

interface ToastMessageProps {
    toasts: ToastItem[];
}

/**
 * ToastMessage - Komponen UI untuk menampilkan toast notifikasi sementara di bagian bawah tengah layar.
 *
 * Props:
 * @param {ToastItem[]} toasts - Array dari objek toast yang akan ditampilkan. Tiap item berisi:
 *   - `type`: Jenis toast (`info`, `success`, `error`, `warning`)
 *   - `message`: Pesan teks yang ditampilkan
 *
 * 🧠 Fitur:
 * - Menggunakan Tailwind + DaisyUI class `toast` dan `alert`
 * - Posisi: `toast-center toast-bottom z-50`
 * - Hanya dirender jika ada toast (toasts.length > 0)
 * - Styling otomatis berdasarkan `type` (warna alert sesuai)
 *
 * 📦 Contoh penggunaan:
 * const { toasts } = useToast();
 * <ToastMessage toasts={toasts} />
 *
 * 🔁 Biasanya dipakai bersamaan dengan hook: `useToast`
 */
export const ToastMessage: React.FC<ToastMessageProps> = ({ toasts }) => {
    if (toasts.length === 0) return null;

    return (
        <div className="toast toast-center toast-bottom z-50">
            {toasts.map((toast, idx) => (
                <div
                    key={idx}
                    className={clsx('alert', {
                        'alert-info': toast.type === 'info',
                        'alert-success': toast.type === 'success',
                        'alert-error': toast.type === 'error',
                        'alert-warning': toast.type === 'warning',
                    })}
                >
                    <span>{toast.message}</span>
                </div>
            ))}
        </div>
    );
};
