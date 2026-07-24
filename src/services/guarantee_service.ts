import {
    IGuarantee,
    IGuaranteePayload,
    GuaranteeTypeEnum
} from 'interfaces/guarantee';
import { IPaginatedResponse } from 'interfaces/pagination';
import { api } from './api';

const ROUTE = '/guarantees';

export interface GetGuaranteesParams {
    skip?: number;
    limit?: number;
    search_term?: string;
    guarantee_type?: GuaranteeTypeEnum | string;
}

export const GuaranteeService = {
    getPaginate: async (
        params: GetGuaranteesParams
    ): Promise<IPaginatedResponse<IGuarantee>> => {
        const { data } = await api.get<IPaginatedResponse<IGuarantee>>(ROUTE, {
            params
        });
        return data;
    },

    getByKey: async (key: string): Promise<IGuarantee> => {
        const { data } = await api.get<IGuarantee>(`${ROUTE}/${key}`);
        return data;
    },

    create: async (payload: IGuaranteePayload): Promise<IGuarantee> => {
        const { data } = await api.post<IGuarantee>(ROUTE, payload);
        return data;
    },

    update: async (
        key: string,
        payload: IGuaranteePayload
    ): Promise<IGuarantee> => {
        const { data } = await api.put<IGuarantee>(`${ROUTE}/${key}`, payload);
        return data;
    },

    delete: async (key: string): Promise<void> => {
        await api.delete(`${ROUTE}/${key}`);
    }
};
