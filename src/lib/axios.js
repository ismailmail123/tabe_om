import axios from 'axios';

// 1. Buat instance axios dasar dengan withCredentials
export const axiosInstance = axios.create({
    baseURL: 'https://batarirtnbantaeng.cloud/api',
    withCredentials: true // Ini penting untuk mengirim cookie
});

// 2. Simpan fungsi logout di variabel
let logoutFunction = () => {
    console.error('Logout function belum di-setup!');
};

// 3. Flag untuk mencegah multiple refresh token requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// 4. Export fungsi untuk setup interceptor
export const setupInterceptors = (logoutFn) => {
    logoutFunction = logoutFn;

    axiosInstance.interceptors.response.use(
        response => response,
        async(error) => {
            const originalRequest = error.config;

            // Cek jika error 401 Unauthorized dan bukan request refresh token
            if (error.response.status === 401 && !originalRequest._retry) {

                // Jika error terjadi di endpoint refresh-token, langsung logout
                if (originalRequest.url.includes('/auth/v1/refresh-token')) {
                    clearUserData();
                    logoutFunction();
                    return Promise.reject(error);
                }

                // Jika sedang proses refresh token, tambahkan ke queue
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    }).then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axiosInstance(originalRequest);
                    }).catch(err => {
                        return Promise.reject(err);
                    });
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    // Panggil endpoint refresh token (cookie akan otomatis dikirim)
                    const res = await axiosInstance.post('/auth/v1/refresh-token');

                    // Update access token baru
                    const newToken = res.data.token;
                    localStorage.setItem('token', newToken);

                    // Update Authorization header untuk request selanjutnya
                    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

                    // Process queued requests
                    processQueue(null, newToken);

                    // Coba ulang request asli dengan token baru
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    console.error('Refresh token failed:', refreshError);
                    processQueue(refreshError, null);
                    clearUserData();
                    logoutFunction();
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }

            // Untuk error selain 401, langsung reject
            return Promise.reject(error);
        }
    );

    // Interceptor untuk menambahkan token ke header
    axiosInstance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
};

// Fungsi bersihkan semua data user
const clearUserData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authUser');
    // Jangan clear semua localStorage, hanya data auth
};

export default axiosInstance;