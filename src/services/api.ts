/* eslint-disable no-param-reassign */
import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
});

api.interceptors.request.use(
    (config) => {
        const token =
            typeof window !== 'undefined'
                ? localStorage.getItem('@RentalManager:token')
                : null;

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('@RentalManager:token');
                localStorage.removeItem('@RentalManager:user');

                if (window.location.pathname !== '/') {
                    window.location.href = '/?session_expired=true';
                }
            }
        }
        return Promise.reject(error);
    }
);
