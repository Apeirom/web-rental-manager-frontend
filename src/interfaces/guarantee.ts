// src/interfaces/guarantee.ts

export type GuaranteeTypeEnum = 'deposit' | 'guarantor' | 'bail_insurance';

export interface IGuaranteeBase {
    key: string;
    type: GuaranteeTypeEnum;
}

export interface IDeposit extends IGuaranteeBase {
    type: 'deposit';
    amount: number;
    paid_in_cash?: boolean;
    deposit_date?: string;
}

export interface IGuarantor extends IGuaranteeBase {
    type: 'guarantor';
    name: string;
    document_number: string;
}

export interface IBailInsurance extends IGuaranteeBase {
    type: 'bail_insurance';
    value: number;
    validity: string;
    insurance_company: string;
}

export type IGuarantee = IDeposit | IGuarantor | IBailInsurance;

export type IGuaranteePayload =
    | Omit<IDeposit, 'key'>
    | Omit<IGuarantor, 'key'>
    | Omit<IBailInsurance, 'key'>;
