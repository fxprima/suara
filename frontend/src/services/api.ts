import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

let isRefreshing = false;

// 👉 Request Interceptor: Pasang Authorization header kalau token ada
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

// 👉 Response Interceptor: Tangani 401 → Refresh → Retry original request
api.interceptors.response.use(
    (res) => {
        console.log('[RESPONSE]', res.config.url, '→', res.status);
        return res;
    },
    async (err) => {
        const originalRequest = err.config;
        console.log('[RESPONSE ERROR]', err.config?.url, '→', err.response?.status);

        if (err.response?.status === 401 && !originalRequest._retry && !isRefreshing) {
            console.log('[INTERCEPTOR] Detected 401, attempting refresh...');
            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshRes = await api.post('/auth/refresh', {}, { withCredentials: true });
                const newAccessToken = refreshRes.data.accessToken;
                console.log('[REFRESH] Success → New token:', newAccessToken?.slice(0, 20), '...');

                // Simpan token & pasang ke header
                localStorage.setItem('accessToken', newAccessToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                return api(originalRequest); // Retry
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
