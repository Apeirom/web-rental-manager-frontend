import { IExtract, IExtractPayload } from 'interfaces/extract';
import { IPaginatedResponse } from 'interfaces/pagination';
import { api } from './api';

const ROUTE = '/extracts';

export interface GetExtractsParams {
    skip?: number;
    limit?: number;
    search_term?: string;
    only_active_contracts?: boolean;
}

export const ExtractService = {
    getPaginate: async (
        params: GetExtractsParams
    ): Promise<IPaginatedResponse<IExtract>> => {
        const { data } = await api.get<IPaginatedResponse<IExtract>>(ROUTE, {
            params
        });
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
