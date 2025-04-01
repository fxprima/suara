'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { useRouter } from 'next/navigation';

export type AuthUser = {
    id: string;
    email: string;
    username: string;
    firstname: string;
    lastname: string;
};

export default function useAuth() {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const fetchUser = async () => {
        try {
            const res = await api.get('/auth/me', { withCredentials: true });
            setUser(res.data);
        } catch (err) {
            setError('Not authenticated');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            const res = await api.post('/auth/logout', {}, { withCredentials: true });
            localStorage.removeItem('accessToken');
            router.replace('/');
        } catch (error: unknown) {
            
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return {
        user,
        loading,
        error,
        logout,
        isAuthenticated: !!user,
    };
}
