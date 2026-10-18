import { ExtractItemCategory } from 'constants/extract';

export interface IExtractItem {
    key?: string;
    category: ExtractItemCategory;
    description: string;
    amount: number;
    is_credit: boolean;
    is_withheld_at_source: boolean;
}

export interface IExtractItemPayload {
    key?: string;
    category: ExtractItemCategory;
    description: string;
    amount: number;
    is_credit: boolean;
    is_withheld_at_source: boolean;
}
