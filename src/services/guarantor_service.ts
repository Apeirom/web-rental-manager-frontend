import { IGuarantor, IGuarantorPayload } from 'interfaces/guarantor';
import { IPaginatedResponse } from 'interfaces/pagination';
import { api } from './api';

const ROUTE = '/guarantors';

export interface GetGuarantorsParams {
    skip?: number;
    limit?: number;
    search_term?: string;
    name?: string;
    document_number?: string;
    only_active_contracts?: boolean;
}

export const GuarantorService = {
    getPaginate: async (
        params: GetGuarantorsParams
    ): Promise<IPaginatedResponse<IGuarantor>> => {
        const { data } = await api.get<IPaginatedResponse<IGuarantor>>(ROUTE, {
            params
        });
        return data;
    },
    getByKey: async (key: string): Promise<IGuarantor> => {
        const { data } = await api.get<IGuarantor>(`${ROUTE}/${key}`);
        return data;
    },
    create: async (payload: IGuarantorPayload): Promise<IGuarantor> => {
        const { data } = await api.post<IGuarantor>(ROUTE, payload);
        return data;
    },
    update: async (
        key: string,
        payload: IGuarantorPayload
    ): Promise<IGuarantor> => {
        const { data } = await api.put<IGuarantor>(`${ROUTE}/${key}`, payload);
        return data;
    },
    delete: async (key: string): Promise<void> => {
        await api.delete(`${ROUTE}/${key}`);
    }
};
