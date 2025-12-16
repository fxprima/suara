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

/**
 * useAuth - Custom hook untuk mengelola state autentikasi user di frontend.
 *
 * @returns {{
*   user: AuthUser | null,
*   loading: boolean,
*   error: string | null,
*   logout: () => Promise<void>,
*   isAuthenticated: boolean
* }}
*
*  Fitur:
* - Fetch user dari `/auth/me` saat mount
* - Simpan user ke state jika login berhasil
* - Jika gagal, atur `error` dan `user = null`
* - Fungsi `logout()` juga clear token + redirect ke `/`
*
*  Contoh penggunaan:
* const { user, loading, isAuthenticated, logout } = useAuth();
*
*  Tips:
* - Gunakan `loading` untuk spinner saat data belum siap
* - Gunakan `isAuthenticated` untuk guard halaman
*/
export default function useAuth() {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const fetchUser = async () => {
        try {
            const res = await api.get('/auth/me', { withCredentials: true });
            setUser(res.data);
        } catch (err: unknown) {
            console.log(err);
            setError('Not authenticated');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout', {}, { withCredentials: true });
            localStorage.removeItem('accessToken');
            router.replace('/');
        } catch (error: unknown) {
            console.log(error)
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
