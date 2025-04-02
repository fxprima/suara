'use client';

import { ToastItem } from '@/components/ui/toast/ToastMessage';
import { useState, useCallback } from 'react';

/**
 * useToast - Custom hook untuk menampilkan toast messages secara simple dan minimal.
 *
 * @returns {{
*   toasts: ToastItem[],
*   showToast: (message: string, type?: 'success' | 'error' | 'info', duration?: number) => void
* }}
*
* 🧃 Fitur:
* - Kelola array `toasts` secara internal
* - `showToast` akan menambahkan toast baru dan menghapus toast pertama setelah durasi tertentu
* - Tipe toast default: `'info'`, bisa juga `'success'` atau `'error'`
*
* 📦 Contoh penggunaan:
* const { toasts, showToast } = useToast();
* showToast('Berhasil posting!', 'success', 2000);
*
* 💡 Untuk menampilkan UI toast, render komponen:
* <ToastMessage toasts={toasts} />
*/
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
