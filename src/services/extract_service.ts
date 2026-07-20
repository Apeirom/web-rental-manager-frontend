import {
    IExtract,
    IExtractBatch,
    IExtractBatchPayload
} from 'interfaces/extract';
import { IPaginatedResponse } from 'interfaces/pagination';
import { IPaymentReconciliation } from 'interfaces/payment';
import { api } from './api';

const ROUTE = '/extract-batches';

export interface GetExtractBatchesParams {
    skip?: number;
    limit?: number;
    search_term?: string;
    only_active_contracts?: boolean;
    is_reconciled?: boolean;
}

export const ExtractBatchService = {
    getPaginate: async (
        params: GetExtractBatchesParams
    ): Promise<IPaginatedResponse<IExtractBatch>> => {
        const { data } = await api.get<IPaginatedResponse<IExtractBatch>>(
            ROUTE,
            {
                params
            }
        );
        return data;
    },

    create: async (payload: IExtractBatchPayload): Promise<IExtractBatch> => {
        const { data } = await api.post<IExtractBatch>(ROUTE, payload);
        return data;
    },

    update: async (
        batchKey: string,
        payload: IExtractBatchPayload
    ): Promise<IExtractBatch> => {
        const { data } = await api.put<IExtractBatch>(
            `${ROUTE}/${batchKey}`,
            payload
        );
        return data;
    },

    delete: async (batchKey: string): Promise<void> => {
        await api.delete(`${ROUTE}/${batchKey}`);
    },

    getReconciliationCandidates: async (
        batchKey: string
    ): Promise<IPaymentReconciliation> => {
        const { data } = await api.get<IPaymentReconciliation>(
            `${ROUTE}/${batchKey}/reconcile`
        );
        return data;
    },

    uploadReceipt: async (
        batchKey: string,
        file: File
    ): Promise<IExtractBatch> => {
        const formData = new FormData();
        formData.append('file', file);

        const { data } = await api.post<IExtractBatch>(
            `${ROUTE}/${batchKey}/upload-receipt`,
            formData,
            {
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return data;
    },

    // ==========================================
    // OPERAÇÕES DO EXTRATO INDIVIDUAL (NESTED)
    // ==========================================

    getIndividualExtract: async (
        batchKey: string,
        extractKey: string
    ): Promise<IExtract> => {
        const { data } = await api.get<IExtract>(
            `${ROUTE}/${batchKey}/extracts/${extractKey}`
        );
        return data;
    },

    deleteIndividualExtract: async (
        batchKey: string,
        extractKey: string
    ): Promise<void> => {
        await api.delete(`${ROUTE}/${batchKey}/extracts/${extractKey}`);
    }
};
