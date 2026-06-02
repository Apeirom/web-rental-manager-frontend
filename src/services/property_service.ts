import { IProperty, IPropertyPayload } from 'interfaces/property';
import { IPaginatedResponse } from 'interfaces/pagination';
import { api } from './api';

const ROUTE = '/properties';

export interface GetPropertiesParams {
    skip?: number;
    limit?: number;
    search_term?: string;
    property_name?: string;
    owner_name?: string;
    only_active_contracts?: boolean;
}

export const PropertyService = {
    getPaginate: async (
        params: GetPropertiesParams
    ): Promise<IPaginatedResponse<IProperty>> => {
        const { data } = await api.get<IPaginatedResponse<IProperty>>(ROUTE, {
            params
        });
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
