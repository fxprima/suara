'use client';

import { ToastItem } from '@/components/toast/ToastMessage';
import { useState, useCallback } from 'react';

export const useToast = () => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const showToast = useCallback((message: string, type: ToastItem['type'] = 'info', duration = 3000) => {
        const id = Date.now(); 
        const newToast = { type, message };

        setToasts((prev) => [...prev, newToast]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((_, i) => i !== 0));
        }, duration);
    }, []);

    return { toasts, showToast };
};
