import {
    IBailInsurance,
    IBailInsurancePayload
} from 'interfaces/bail_insurance';
import { IPaginatedResponse } from 'interfaces/pagination';
import { api } from './api';

const ROUTE = '/bail-insurances';

export interface GetBailInsurancesParams {
    skip?: number;
    limit?: number;
    search_term?: string;
    insurance_company?: string;
    validity?: string;
    only_active_contracts?: boolean;
}

export const BailInsuranceService = {
    getPaginate: async (
        params: GetBailInsurancesParams
    ): Promise<IPaginatedResponse<IBailInsurance>> => {
        const { data } = await api.get<IPaginatedResponse<IBailInsurance>>(
            ROUTE,
            { params }
        );
        return data;
    },
    getByKey: async (key: string): Promise<IBailInsurance> => {
        const { data } = await api.get<IBailInsurance>(`${ROUTE}/${key}`);
        return data;
    },
    create: async (payload: IBailInsurancePayload): Promise<IBailInsurance> => {
        const { data } = await api.post<IBailInsurance>(ROUTE, payload);
        return data;
    },
    update: async (
        key: string,
        payload: IBailInsurancePayload
    ): Promise<IBailInsurance> => {
        const { data } = await api.put<IBailInsurance>(
            `${ROUTE}/${key}`,
            payload
        );
        return data;
    },
    delete: async (key: string): Promise<void> => {
        await api.delete(`${ROUTE}/${key}`);
    }
};
