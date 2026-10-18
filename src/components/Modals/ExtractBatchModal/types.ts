// src/components/Modals/ExtractBatchModal/types.ts
import { ExtractItemCategory } from 'constants/extract';
import { IExtractItemPayload } from 'interfaces/extract_item';

export type IFixedItems = Partial<Record<ExtractItemCategory, number>>;

export interface IFormExtract {
    key?: string;
    contract_key: string;
    month_ref: number;
    year_ref: number;
    fixedItems: IFixedItems;
    dynamicCredits: IExtractItemPayload[];
    dynamicDebits: IExtractItemPayload[];
}

export interface IFormValues {
    extracts: IFormExtract[];
}
