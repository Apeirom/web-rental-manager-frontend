import type { IncomeTaxTenantType } from 'constants/reports';

export interface IIncomeTaxItem {
    key: string;
    category: string;
    description: string;
    amount: number;
}

export interface IIncomeTaxExtract {
    extract_key: string;
    owner_key: string;
    owner_name: string;
    reference_date: string;
    payment_date: string;
    tenant_name: string;
    tenant_document_number: string;
    tenant_document_type: 'PF' | 'PJ';
    property_name: string;
    participation_percentage: number;
    rent: number;
    interest: number;
    penalty: number;
    administration_fee: number;
    iptu: number;
    total_income: number;
    total_deductions: number;
    taxable_base: number;
    income_items: IIncomeTaxItem[];
    deduction_items: IIncomeTaxItem[];
}

export interface IIncomeTaxSummary {
    owner_key: string | null;
    owner_name: string | null;
    start_date: string | null;
    end_date: string;
    total_income: number;
    total_deductions: number;
    taxable_base: number;
    extracts: IIncomeTaxExtract[];
}

export interface IIncomeTaxReportParams {
    owner_key?: string;
    start_date?: string;
    end_date?: string;
    tenant_type?: IncomeTaxTenantType;
}
