'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/services/api';

export function useFetchData<T = any>(url: string) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(
        async (silent = false) => {
            try {
                if (!silent) setLoading(true);
                const response = await api.get<T>(url);
                setData(response.data);
                setError(null);
            } catch (err: any) {
                console.error('[useFetchData]', err);
                setError(err.response?.data?.message || 'Something went wrong');
            } finally {
                if (!silent) setLoading(false);
            }
        },
        [url]
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
