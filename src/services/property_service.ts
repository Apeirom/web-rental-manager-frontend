import { IProperty, IPropertyPayload } from 'interfaces/property';
import { api } from './api';

const ROUTE = '/properties';

export const PropertyService = {
    getAll: async (): Promise<IProperty[]> => {
        const { data } = await api.get<IProperty[]>(ROUTE);
        return data;
    },
    getByKey: async (key: string): Promise<IProperty> => {
        const { data } = await api.get<IProperty>(`${ROUTE}/${key}`);
        return data;
    },
    create: async (payload: IPropertyPayload): Promise<IProperty> => {
        const { data } = await api.post<IProperty>(ROUTE, payload);
        return data;
    },
    update: async (
        key: string,
        payload: IPropertyPayload
    ): Promise<IProperty> => {
        const { data } = await api.put<IProperty>(`${ROUTE}/${key}`, payload);
        return data;
    },
    delete: async (key: string): Promise<void> => {
        await api.delete(`${ROUTE}/${key}`);
    }
};
