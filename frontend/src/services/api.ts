import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

let isRefreshing = false;

// Daftar route publik yang gak perlu refresh token
const PUBLIC_ROUTES = ['/auth/signin', '/auth/register', '/auth/refresh'];

// Utility buat ngecek apakah URL request termasuk public route
const isPublicRoute = (url?: string) => {
    return PUBLIC_ROUTES.some((route) => url?.startsWith(route));
};

// Request Interceptor → Tambahkan Authorization header kalau token tersedia
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        console.log('[REQUEST]', config.url, '→ token:', token?.slice(0, 20), '...');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.log('[REQUEST ERROR]', error);
        return Promise.reject(error);
    }
);

// Response Interceptor → Tangani 401 → Refresh Token → Retry Request
api.interceptors.response.use(
    (res) => {
        console.log('[RESPONSE]', res.config.url, '→', res.status);
        return res;
    },
    async (err) => {
        const originalRequest = err.config;

        const pathname = new URL(originalRequest.url, api.defaults.baseURL).pathname;

        if (isPublicRoute(pathname)) {
            console.log('[SKIP] Public route, no refresh logic:', pathname);
            return Promise.reject(err);
        }

        if (err.response?.status === 401 && !originalRequest._retry && !isRefreshing) {
            console.log('[INTERCEPTOR] Detected 401, attempting refresh...');
            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshRes = await api.post('/auth/refresh', {}, { withCredentials: true });
                const newAccessToken = refreshRes.data.accessToken;
                console.log('[REFRESH] Success → New token:', newAccessToken?.slice(0, 20), '...');

                localStorage.setItem('accessToken', newAccessToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                console.log('[REFRESH] Failed:', refreshError);
                localStorage.removeItem('accessToken');
                window.location.href = '/';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(err);
    }
);


export default api;
