import { ITenant, ITenantPayload } from 'interfaces/tenant';
import { IPaginatedResponse } from 'interfaces/pagination';
import { api } from './api';

const ROUTE = '/tenants';

export interface GetTenantsParams {
    skip?: number;
    limit?: number;
    search_term?: string;
    name?: string;
    document_number?: string;
    only_active_contracts?: boolean;
}

export const TenantService = {
    getPaginate: async (
        params: GetTenantsParams
    ): Promise<IPaginatedResponse<ITenant>> => {
        const { data } = await api.get<IPaginatedResponse<ITenant>>(ROUTE, {
            params
        });
        return data;
    },
    getByKey: async (key: string): Promise<ITenant> => {
        const { data } = await api.get<ITenant>(`${ROUTE}/${key}`);
        return data;
    },
    create: async (payload: ITenantPayload): Promise<ITenant> => {
        const { data } = await api.post<ITenant>(ROUTE, payload);
        return data;
    },
    update: async (key: string, payload: ITenantPayload): Promise<ITenant> => {
        const { data } = await api.put<ITenant>(`${ROUTE}/${key}`, payload);
        return data;
    },
    delete: async (key: string): Promise<void> => {
        await api.delete(`${ROUTE}/${key}`);
    }
};
