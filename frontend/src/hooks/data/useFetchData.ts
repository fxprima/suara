'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/services/api';
import { extractErrorMessage } from '@/utils/handleApiError';

/**
 * React hook untuk mengambil data dari API menggunakan Axios instance.
 *
 * Hook ini akan otomatis melakukan fetch ketika `url` tersedia
 * dan opsi `enabled` bernilai `true`.
 *
 * @typeParam T - Tipe data response dari API
 *
 * @param url - Endpoint API yang akan dipanggil.
 * Jika `undefined`, fetch tidak akan dijalankan.
 *
 * @param opts - Opsi tambahan untuk konfigurasi hook.
 * @param opts.enabled - Menentukan apakah fetch boleh dijalankan atau tidak.
 * Default: `true`
 *
 * @returns Object berisi state dan helper function:
 * - `data`: Data hasil fetch
 * - `loading`: Status loading
 * - `error`: Pesan error (jika ada)
 * - `refetch`: Fetch ulang dengan menampilkan loading
 * - `silentRefetch`: Fetch ulang tanpa mengubah state loading
 *
 * @example
 * ```ts
 * const { data, loading, error } =
 *   useFetchData<UserPublicProfile>('user/profile/john_doe');
 * ```
 *
 * @example
 * ```ts
 * // Fetch ulang tanpa spinner
 * silentRefetch();
 * ```
 */
export function useFetchData<T = unknown>(url?: string, opts?: { enabled?: boolean }) {
    const enabled = opts?.enabled ?? true;

    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(Boolean(url) && enabled);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(
        async (silent = false) => {
        if (!url || !enabled) {
            setLoading(false);
            return;
        }
        try {
            if (!silent) setLoading(true);
            const response = await api.get<T>(url);
            setData(response.data);
            setError(null);
        } catch (err: unknown) {
            console.error('[useFetchData]', err);
            setError(extractErrorMessage(err));
        } finally {
            if (!silent) setLoading(false);
        }
        },
        [url, enabled]
    );

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        loading,
        error,
        refetch: () => fetchData(false),
        silentRefetch: () => fetchData(true),
    };
}
