import { IContract } from './contract';
import { IPayment } from './payment';

export const EXTRACT_ITEM_CATEGORIES = {
    rent: {
        description: 'Aluguel',
        kind: 'fixed',
        is_withheld_at_source: false,
        is_credit: true
    },
    agreement: {
        description: 'Taxa de Contrato/Intermediação',
        kind: 'dynamic',
        is_withheld_at_source: null,
        is_credit: null
    },
    iptu: {
        description: 'IPTU',
        kind: 'fixed',
        is_withheld_at_source: false,
        is_credit: false
    },
    water: {
        description: 'Água',
        kind: 'fixed',
        is_withheld_at_source: false,
        is_credit: false
    },
    maintenance: {
        description: 'Manutenção',
        kind: 'dynamic',
        is_withheld_at_source: null,
        is_credit: null
    },
    penalty: {
        description: 'Multa por Atraso',
        kind: 'fixed',
        is_withheld_at_source: false,
        is_credit: true
    },
    interest: {
        description: 'Juros por Atraso',
        kind: 'fixed',
        is_withheld_at_source: false,
        is_credit: true
    },
    bank_fee: {
        description: 'Taxa Bancária',
        kind: 'fixed',
        is_withheld_at_source: true,
        is_credit: false
    },
    administration_fee: {
        description: 'Taxa de Administração',
        kind: 'fixed',
        is_withheld_at_source: true,
        is_credit: false
    },
    others: {
        description: 'Outros',
        kind: 'dynamic',
        is_withheld_at_source: null,
        is_credit: null
    }
} as const;

export type ExtractItemCategory = keyof typeof EXTRACT_ITEM_CATEGORIES;

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

export const EXTRACT_ITEM_CATEGORY_OPTIONS = Object.entries(
    EXTRACT_ITEM_CATEGORIES
).map(([value, category]) => ({
    value: value as ExtractItemCategory,
    label: category.description
}));

export const EXTRACT_DYNAMIC_CATEGORY_OPTIONS =
    EXTRACT_ITEM_CATEGORY_OPTIONS.filter(
        ({ value }) => EXTRACT_ITEM_CATEGORIES[value].kind === 'dynamic'
    );

export interface IExtractItem {
    key?: string;
    category: ExtractItemCategory;
    description: string;
    amount: number;
    is_credit: boolean;
    is_withheld_at_source: boolean;
}

export interface IExtract {
    key: string;
    month_ref: number;
    year_ref: number;
    net_transfer: number;
    contract: IContract;
    items: IExtractItem[];
}

export interface IExtractBatch {
    key: string;
    total_net_transfer: number;
    file_path?: string;
    status: 'linked' | 'unlinked';
    extracts: IExtract[];
    payment?: IPayment;
}

// ==========================================
// PAYLOADS DE ENVIO (POST / PUT)
// ==========================================

export interface IExtractItemPayload {
    key?: string;
    category: ExtractItemCategory;
    description: string;
    amount: number;
    is_credit: boolean;
    is_withheld_at_source: boolean;
}

export interface IExtractPayload {
    key?: string;
    contract_key: string;
    month_ref: number;
    year_ref: number;
    items: IExtractItemPayload[];
}

export interface IExtractBatchPayload {
    file_path?: string | null;
    extracts: IExtractPayload[];
}

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
