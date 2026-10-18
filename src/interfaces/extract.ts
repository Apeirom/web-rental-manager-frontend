import { IContract } from './contract';
import { IExtractItem, IExtractItemPayload } from './extract_item';

export interface IExtract {
    key: string;
    month_ref: number;
    year_ref: number;
    net_transfer: number;
    contract: IContract;
    items: IExtractItem[];
}

// ==========================================
// PAYLOADS DE ENVIO (POST / PUT)
// ==========================================

export interface IExtractPayload {
    key?: string;
    contract_key: string;
    month_ref: number;
    year_ref: number;
    items: IExtractItemPayload[];
}
