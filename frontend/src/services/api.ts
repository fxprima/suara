import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Daftar route publik yang gak perlu refresh token
const PUBLIC_ROUTES = ['/auth/signin', '/auth/register', '/auth/refresh'];

// Utility buat ngecek apakah URL request termasuk public route
const isPublicRoute = (url?: string) => {
    return PUBLIC_ROUTES.some((route) => url?.startsWith(route));
};

function subscribeTokenRefresh(cb: (token: string) => void) {
    refreshSubscribers.push(cb);
}

function onTokenRefreshed(token: string) {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
}

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        console.log('[REQUEST]', config.url, '→ token:', token?.slice(0, 20), '...');
        if (token) 
            config.headers.Authorization = `Bearer ${token}`;
        
        return config;
    },
    (error) => {
        console.log('[REQUEST ERROR]', error);
        return Promise.reject(error);
    }
);

// Response Interceptor → Tangani 401 → Refresh Token → Retry Request
api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalRequest = err.config;

        const pathname = new URL(originalRequest.url, api.defaults.baseURL).pathname;

        if (isPublicRoute(pathname)) return Promise.reject(err);

        if (err.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve) => {
                    subscribeTokenRefresh((newToken) => {
                        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                        resolve(api(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const response = await api.post('/auth/refresh', {}, { withCredentials: true });
                const newAccessToken = response.data.accessToken;

                localStorage.setItem('accessToken', newAccessToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                onTokenRefreshed(newAccessToken);

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
