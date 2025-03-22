import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

const EXCLUDED_ROUTES = ['/auth/signin', '/auth/register'];

api.interceptors.request.use(async (config) => {
    const requestUrl = `${config.baseURL}${config.url}`;
    if (EXCLUDED_ROUTES.some((path) => requestUrl.includes(path))) 
        return config; 

    const session = await getSession();
    if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) 
            await signOut({ callbackUrl: '/' });
        
        return Promise.reject(error);
    }
);

export default api;
