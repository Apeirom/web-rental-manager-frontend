import { IContract } from './contract';
import { IPayment } from './payment';

export interface IExtract {
    key: string;
    month_ref: number;
    year_ref: number;

    rent_amount: number;
    iptu: number;
    water: number;
    maintenance: number;
    agreement: number;
    penalty: number;
    interest: number;
    other_revenues: number;

    administration_fee: number;
    bank_fee: number;
    net_transfer: number;

    contract: IContract;
}

export interface IExtractBatch {
    key: string;
    total_net_transfer: number;
    file_path?: string;
    status: 'linked' | 'unlinked';
    extracts: IExtract[];
    payment?: IPayment;
}

export interface IExtractItemPayload {
    key?: string;
    contract_key: string;
    month_ref: number;
    year_ref: number;

    rent_amount: number;
    iptu: number;
    water: number;
    maintenance: number;
    agreement: number;
    penalty: number;
    interest: number;
    other_revenues: number;
    bank_fee: number;
}

export interface IExtractBatchPayload {
    file_path?: string | null;
    extracts: IExtractItemPayload[];
}
