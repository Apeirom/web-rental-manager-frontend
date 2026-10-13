import { IOwner, IOwnerPayload } from 'interfaces/owner';
import { IPaginatedResponse } from 'interfaces/pagination';
import { api } from './api';

const ROUTE = '/owners';

export interface GetOwnersParams {
    skip?: number;
    limit?: number;
    search_term?: string;
}

export const OwnerService = {
    getPaginate: async (
        params: GetOwnersParams
    ): Promise<IPaginatedResponse<IOwner>> => {
        const { data } = await api.get<IPaginatedResponse<IOwner>>(ROUTE, {
            params
        });
        return data;
    },
    getByKey: async (key: string): Promise<IOwner> => {
        const { data } = await api.get<IOwner>(`${ROUTE}/${key}`);
        return data;
    },
    create: async (payload: IOwnerPayload): Promise<IOwner> => {
        const { data } = await api.post<IOwner>(ROUTE, payload);
        return data;
    },
    update: async (key: string, payload: IOwnerPayload): Promise<IOwner> => {
        const { data } = await api.put<IOwner>(`${ROUTE}/${key}`, payload);
        return data;
    },
    delete: async (key: string): Promise<void> => {
        await api.delete(`${ROUTE}/${key}`);
    }
};
