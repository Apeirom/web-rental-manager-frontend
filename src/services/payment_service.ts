import { IPayment, IPaymentPayload } from 'interfaces/payment';
import { api } from './api';

const ROUTE = '/payments';

export const PaymentService = {
    getAll: async (): Promise<IPayment[]> => {
        const { data } = await api.get<IPayment[]>(ROUTE);
        return data;
    },
    getByKey: async (key: string): Promise<IPayment> => {
        const { data } = await api.get<IPayment>(`${ROUTE}/${key}`);
        return data;
    },
    create: async (payload: IPaymentPayload): Promise<IPayment> => {
        const { data } = await api.post<IPayment>(ROUTE, payload);
        return data;
    },
    update: async (
        key: string,
        payload: IPaymentPayload
    ): Promise<IPayment> => {
        const { data } = await api.put<IPayment>(`${ROUTE}/${key}`, payload);
        return data;
    },
    delete: async (key: string): Promise<void> => {
        await api.delete(`${ROUTE}/${key}`);
    }
};
