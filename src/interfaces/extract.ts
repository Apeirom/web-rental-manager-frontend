import { IContract } from './contract';

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

    receipt_path?: string | null;
    contract: IContract;
}

export interface IExtractPayload {
    month_ref: number;
    year_ref: number;
    receipt_path?: string | null;
    rent_amount?: number;
    iptu?: number;
    water?: number;
    maintenance?: number;
    agreement?: number;
    penalty?: number;
    interest?: number;
    other_revenues?: number;
    bank_fee?: number;
    contract_key: string;
}
