import {
    EXTRACT_ITEM_CATEGORIES,
    ExtractItemCategory
} from 'constants/extract';
import { IExtractItem } from 'interfaces/extract_item';
import { IExtract } from 'interfaces/extract';
import { IExtractBatch } from 'interfaces/extract_batch';

export class InvalidExtractStructureError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidExtractStructureError';
    }
}

export const isExtractItemCategory = (
    value: unknown
): value is ExtractItemCategory =>
    typeof value === 'string' &&
    Object.prototype.hasOwnProperty.call(EXTRACT_ITEM_CATEGORIES, value);

export const assertExtractItemCategory: (
    value: unknown,
    context?: string
) => asserts value is ExtractItemCategory = (
    value: unknown,
    context = 'item.category'
) => {
    if (!isExtractItemCategory(value)) {
        throw new InvalidExtractStructureError(
            `Categoria de extrato inválida em ${context}: ${String(value)}`
        );
    }
};

export const assertExtractItem: (
    value: unknown,
    context: string
) => asserts value is IExtractItem = (value: unknown, context: string) => {
    if (!value || typeof value !== 'object') {
        throw new InvalidExtractStructureError(`${context} inválido`);
    }

    const item = value as Partial<IExtractItem>;
    assertExtractItemCategory(item.category, `${context}.category`);

    if (
        typeof item.amount !== 'number' ||
        typeof item.description !== 'string' ||
        typeof item.is_credit !== 'boolean' ||
        typeof item.is_withheld_at_source !== 'boolean'
    ) {
        throw new InvalidExtractStructureError(
            `${context} possui campos inválidos`
        );
    }
};

export const assertExtract: (
    value: unknown,
    context?: string
) => asserts value is IExtract = (value, context = 'extract') => {
    if (!value || typeof value !== 'object') {
        throw new InvalidExtractStructureError(`${context} inválido`);
    }

    const extract = value as Partial<IExtract>;
    if (!Array.isArray(extract.items)) {
        throw new InvalidExtractStructureError(
            `${context} não possui items válido`
        );
    }

    extract.items.forEach((item, itemIndex) => {
        assertExtractItem(item, `${context}.items[${itemIndex}]`);
    });
};

export const assertExtractBatch: (
    value: unknown
) => asserts value is IExtractBatch = (value: unknown) => {
    if (!value || typeof value !== 'object') {
        throw new InvalidExtractStructureError('Lote de extratos inválido');
    }

    const batch = value as Partial<IExtractBatch>;
    if (!Array.isArray(batch.extracts)) {
        throw new InvalidExtractStructureError(
            'Lote de extratos não possui extracts válido'
        );
    }

    batch.extracts.forEach((extract, extractIndex) => {
        assertExtract(extract, `extracts[${extractIndex}]`);
    });
};
