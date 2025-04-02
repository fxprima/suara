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
