import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});


const EXCLUDED_ROUTES = ['/auth/signin', '/auth/register', '/auth/refresh', '/api/auth/session'];

api.interceptors.request.use(async (config) => {
    const requestUrl = `${config.baseURL}${config.url}`;

    if (EXCLUDED_ROUTES.some((path) => requestUrl.includes(path))) 
        return config; 
    

    const session = await getSession();
    if (session?.accessToken) 
        config.headers.Authorization = `Bearer ${session.accessToken}`;
    
    return config;
});


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const requestUrl = `${originalRequest.baseURL}${originalRequest.url}`;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !EXCLUDED_ROUTES.some((path) => requestUrl.includes(path))
        ) {
            originalRequest._retry = true;
            try {
                await api.post('/auth/refresh', null, { withCredentials: true });
                const session = await getSession();
                if (session?.accessToken) {
                    originalRequest.headers.Authorization = `Bearer ${session.accessToken}`;
                }
                return api(originalRequest);
            } catch (refreshError) {
                await signOut({ callbackUrl: '/' });
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
