import { IPaginatedResponse } from 'interfaces/pagination';
import { IUser, IUserCreatePayload, IUserUpdatePayload } from 'interfaces/user';
import { api } from './api';

const ROUTE = '/users';

export interface GetUsersParams {
    skip?: number;
    limit?: number;
    search_term?: string;
}

export const UserService = {
    updateMe: async (payload: IUserUpdatePayload): Promise<IUser> => {
        const { data } = await api.put<IUser>(`${ROUTE}/me`, payload);
        return data;
    },

    getPaginate: async (
        params: GetUsersParams
    ): Promise<IPaginatedResponse<IUser>> => {
        const { data } = await api.get<IPaginatedResponse<IUser>>(ROUTE, {
            params
        });
        return data;
    },

    register: async (payload: IUserCreatePayload): Promise<IUser> => {
        const { data } = await api.post<IUser>(`${ROUTE}/register`, payload);
        return data;
    },

    updateRole: async (key: string, role: string): Promise<IUser> => {
        const { data } = await api.patch<IUser>(`${ROUTE}/${key}/role`, {
            role
        });
        return data;
    }
};
