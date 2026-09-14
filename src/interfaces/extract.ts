import { IContract } from './contract';
import { IPayment } from './payment';

export interface IExtractItem {
    key: string;
    category: string;
    description: string;
    amount: number;
    is_credit: boolean;
    is_withheld_at_source: boolean;
}

export interface IExtract {
    key: string;
    month_ref: number;
    year_ref: number;
    net_transfer: number;
    contract: IContract;
    items: IExtractItem[];
}

export interface IExtractBatch {
    key: string;
    total_net_transfer: number;
    file_path?: string;
    status: 'linked' | 'unlinked';
    extracts: IExtract[];
    payment?: IPayment;
}

// ==========================================
// PAYLOADS DE ENVIO (POST / PUT)
// ==========================================

export interface IExtractItemPayload {
    key?: string;
    category: string;
    description: string;
    amount: number;
    is_credit: boolean;
    is_withheld_at_source: boolean;
}

export interface IExtractPayload {
    key?: string;
    contract_key: string;
    month_ref: number;
    year_ref: number;
    items: IExtractItemPayload[];
}

export interface IExtractBatchPayload {
    file_path?: string | null;
    extracts: IExtractPayload[];
}
