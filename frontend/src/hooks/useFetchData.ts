'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/services/api';

/**
 * useFetchData - Custom hook untuk fetch data dari API endpoint menggunakan Axios.
 *
 * @template T - Tipe data yang akan diterima dari response (misalnya GemaType[])
 * @param {string} url - URL endpoint yang ingin di-fetch (contoh: '/gema')
 * @returns {{
*   data: T | null,
*   loading: boolean,
*   error: string | null,
*   refetch: () => Promise<void>
* }}
*
* ✅ Otomatis handle loading & error
* ✅ Bisa di-reuse untuk berbagai endpoint
* ✅ Punya fitur refetch manual
*
* 📦 Contoh penggunaan:
* const { data, loading, error, refetch } = useFetchData<GemaType[]>('/gema');
*/
export function useFetchData<T = any>(url: string) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get<T>(url);
            setData(response.data);
            setError(null);
        } catch (err: any) {
            console.error('[useFetchData]', err);
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
}
