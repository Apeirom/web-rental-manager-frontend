/* eslint-disable no-param-reassign */
import axios from 'axios';

export const api = axios.create({
    // baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    baseURL: 'https://web-retal-manager-backend.onrender.com'
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
