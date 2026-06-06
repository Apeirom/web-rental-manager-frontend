import {
    IPayment,
    IPaymentCreatePayload,
    IPaymentUpdatePayload,
    GetPaymentsParams
} from 'interfaces/payment';
import { IPaginatedResponse } from 'interfaces/pagination';
import { api } from './api';

const ROUTE = '/payments';

export const PaymentService = {
    getPaginate: async (
        params: GetPaymentsParams
    ): Promise<IPaginatedResponse<IPayment>> => {
        const { data } = await api.get<IPaginatedResponse<IPayment>>(ROUTE, {
            params
        });
        return data;
    },

    getByKey: async (key: string): Promise<IPayment> => {
        const { data } = await api.get<IPayment>(`${ROUTE}/${key}`);
        return data;
    },

    create: async (payload: IPaymentCreatePayload): Promise<IPayment> => {
        const { data } = await api.post<IPayment>(ROUTE, payload);
        return data;
    },

    update: async (
        key: string,
        payload: IPaymentUpdatePayload
    ): Promise<IPayment> => {
        const { data } = await api.put<IPayment>(`${ROUTE}/${key}`, payload);
        return data;
    },

    delete: async (key: string): Promise<void> => {
        await api.delete(`${ROUTE}/${key}`);
    }
};
