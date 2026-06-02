import { IRealEstate, IRealEstatePayload } from 'interfaces/real_estate';
import { IPaginatedResponse } from 'interfaces/pagination';
import { api } from './api';

const ROUTE = '/real-estates';

export interface GetRealEstatesParams {
    skip?: number;
    limit?: number;
    search_term?: string;
    name?: string;
    cnpj?: string;
    only_active_contracts?: boolean;
}

export const RealEstateService = {
    getPaginate: async (
        params: GetRealEstatesParams
    ): Promise<IPaginatedResponse<IRealEstate>> => {
        const { data } = await api.get<IPaginatedResponse<IRealEstate>>(ROUTE, {
            params
        });
        return data;
    },
    getByKey: async (key: string): Promise<IRealEstate> => {
        const { data } = await api.get<IRealEstate>(`${ROUTE}/${key}`);
        return data;
    },
    create: async (payload: IRealEstatePayload): Promise<IRealEstate> => {
        const { data } = await api.post<IRealEstate>(ROUTE, payload);
        return data;
    },
    update: async (
        key: string,
        payload: IRealEstatePayload
    ): Promise<IRealEstate> => {
        const { data } = await api.put<IRealEstate>(`${ROUTE}/${key}`, payload);
        return data;
    },
    delete: async (key: string): Promise<void> => {
        await api.delete(`${ROUTE}/${key}`);
    }
};
