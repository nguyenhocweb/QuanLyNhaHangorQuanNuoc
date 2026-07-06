import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";

// 1. Instance chính (Dùng cho mọi request thông thường)
const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true, // Quan trọng: Để gửi cookie đi kèm
    timeout: 60000
});

// 2. Instance phụ (CHỈ DÙNG ĐỂ REFRESH TOKEN)
// Tại sao cần? Để khi gọi refresh, nó KHÔNG chạy qua Request Interceptor của axiosClient
// (tránh việc tự động gắn token cũ vào header gây lỗi 401 giả)
const axiosAuth = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true, // Quan trọng: Vì API refresh cần lấy cookie
});

// --- Request Interceptor ---
axiosClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// --- Response Interceptor ---
axiosClient.interceptors.response.use(
    (response: AxiosResponse) => {

        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        const REFRESH_URL = '/auth/refresh/test';
        // Điều kiện: Lỗi 401 + Chưa retry + Không phải là request refresh token
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes(REFRESH_URL)
        ) {
            originalRequest._retry = true;

            try {
                // SỬA ĐỔI 1: Dùng axiosAuth (instance phụ) để gọi refresh
                // Để tránh dính interceptor request của axiosClient
                await axiosAuth.post(REFRESH_URL);
                return axiosClient(originalRequest);

            } catch (refreshError) {
                // Refresh thất bại -> Logout
                const authState = useAuthStore.getState();
                authState.logout();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosClient;