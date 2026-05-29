import { ITenant, ITenantPayload } from 'interfaces/tenant';
import { api } from './api';

const ROUTE = '/tenants';

export const TenantService = {
    getAll: async (): Promise<ITenant[]> => {
        const { data } = await api.get<ITenant[]>(ROUTE);
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
