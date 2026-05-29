import { IGuarantor, IGuarantorPayload } from 'interfaces/guarantor';
import { api } from './api';

const ROUTE = '/guarantors';

export const GuarantorService = {
    getAll: async (): Promise<IGuarantor[]> => {
        const { data } = await api.get<IGuarantor[]>(ROUTE);
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
