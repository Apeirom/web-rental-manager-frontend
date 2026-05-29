import { IExtract, IExtractPayload } from 'interfaces/extract';
import { api } from './api';

const ROUTE = '/extracts';

export const ExtractService = {
    getAll: async (): Promise<IExtract[]> => {
        const { data } = await api.get<IExtract[]>(ROUTE);
        return data;
    },
    getByKey: async (key: string): Promise<IExtract> => {
        const { data } = await api.get<IExtract>(`${ROUTE}/${key}`);
        return data;
    },
    create: async (payload: IExtractPayload): Promise<IExtract> => {
        const { data } = await api.post<IExtract>(ROUTE, payload);
        return data;
    },
    update: async (
        key: string,
        payload: IExtractPayload
    ): Promise<IExtract> => {
        const { data } = await api.put<IExtract>(`${ROUTE}/${key}`, payload);
        return data;
    },
    delete: async (key: string): Promise<void> => {
        await api.delete(`${ROUTE}/${key}`);
    },
    // Função especial para upload do comprovante de repasse
    uploadReceipt: async (key: string, file: File): Promise<IExtract> => {
        const formData = new FormData();
        formData.append('file', file);

        const { data } = await api.post<IExtract>(
            `${ROUTE}/${key}/upload-receipt`,
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
