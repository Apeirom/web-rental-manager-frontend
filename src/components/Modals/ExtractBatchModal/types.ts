// src/components/Modals/ExtractBatchModal/types.ts

export interface IDynamicItem {
    key?: string;
    category: string;
    description: string;
    amount: number;
    is_withheld_at_source: boolean;
    is_credit?: boolean;
}

export interface IFormExtract {
    key?: string;
    contract_key: string;
    month_ref: number;
    year_ref: number;
    rent_amount?: number;
    penalty?: number;
    interest?: number;
    iptu?: number;
    water?: number;
    administration_fee?: number;
    bank_fee?: number;
    dynamic_credits: IDynamicItem[];
    dynamic_debits: IDynamicItem[];
}

export interface IFormValues {
    extracts: IFormExtract[];
}

export interface IPayloadItem {
    key?: string;
    category: string;
    description: string;
    amount: number;
    is_credit: boolean;
    is_withheld_at_source: boolean;
}
