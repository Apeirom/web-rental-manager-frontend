import {
    IBailInsurance,
    IBailInsurancePayload
} from 'interfaces/bail_insurance';
import { api } from './api';

const ROUTE = '/bail-insurances';

export const BailInsuranceService = {
    getAll: async (): Promise<IBailInsurance[]> => {
        const { data } = await api.get<IBailInsurance[]>(ROUTE);
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
