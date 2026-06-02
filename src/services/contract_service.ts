import { IContract, IContractPayload } from 'interfaces/contract';
import { IPaginatedResponse } from 'interfaces/pagination';
import { api } from './api';

const ROUTE = '/contracts';

export interface GetContractsParams {
    skip?: number;
    limit?: number;
    search_term?: string;
    room_name?: string;
    property_name?: string;
    tenant_name?: string;
    real_estate_name?: string;
    status?: string;
}

export const ContractService = {
    getPaginate: async (
        params: GetContractsParams
    ): Promise<IPaginatedResponse<IContract>> => {
        const { data } = await api.get<IPaginatedResponse<IContract>>(ROUTE, {
            params
        });
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
