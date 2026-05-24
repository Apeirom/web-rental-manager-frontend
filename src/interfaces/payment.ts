import { IContract } from './contract';

export interface IPayment {
    key: string;
    payment_date: string; // O backend envia como string ISO
    month_ref: number;
    year_ref: number;
    receipt_path?: string | null;
    contract: IContract;
}

export interface IPaymentPayload {
    payment_date: string;
    month_ref: number;
    year_ref: number;
    receipt_path?: string | null;
    contract_key: string;
}
