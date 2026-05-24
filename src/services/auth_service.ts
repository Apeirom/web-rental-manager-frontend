import { ILoginResponse } from 'interfaces/auth';
import { api } from './api';

export const AuthService = {
    login: async (email: string, password: string): Promise<ILoginResponse> => {
        const response = await api.post<ILoginResponse>('/auth/login', {
            email,
            password
        });
        return response.data;
    }
};
