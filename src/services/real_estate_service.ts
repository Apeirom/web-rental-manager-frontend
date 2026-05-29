import { IRealEstate, IRealEstatePayload } from 'interfaces/real_estate';
import { api } from './api';

const ROUTE = '/real-estates';

export const RealEstateService = {
    getAll: async (): Promise<IRealEstate[]> => {
        const { data } = await api.get<IRealEstate[]>(ROUTE);
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
