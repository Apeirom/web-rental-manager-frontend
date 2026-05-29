import { IContract, IContractPayload } from 'interfaces/contract';
import { api } from './api';

const ROUTE = '/contracts';

export const ContractService = {
    getAll: async (): Promise<IContract[]> => {
        const { data } = await api.get<IContract[]>(ROUTE);
        return data;
    },
    getByKey: async (key: string): Promise<IContract> => {
        const { data } = await api.get<IContract>(`${ROUTE}/${key}`);
        return data;
    },
    create: async (payload: IContractPayload): Promise<IContract> => {
        const { data } = await api.post<IContract>(ROUTE, payload);
        return data;
    },
    update: async (
        key: string,
        payload: IContractPayload
    ): Promise<IContract> => {
        const { data } = await api.put<IContract>(`${ROUTE}/${key}`, payload);
        return data;
    },
    delete: async (key: string): Promise<void> => {
        await api.delete(`${ROUTE}/${key}`);
    },
    // Função especial para upload do PDF do contrato
    uploadDocument: async (key: string, file: File): Promise<IContract> => {
        const formData = new FormData();
        formData.append('file', file);

        const { data } = await api.post<IContract>(
            `${ROUTE}/${key}/upload-document`,
            formData,
            {
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return data;
    }
};
