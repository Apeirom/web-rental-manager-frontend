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
    partner_share: {
        description: 'Participação de Sócio',
        kind: 'dynamic',
        is_withheld_at_source: null,
        is_credit: null
    },
    others: {
        description: 'Outros',
        kind: 'dynamic',
        is_withheld_at_source: null,
        is_credit: null
    }
} as const;

export type ExtractItemCategory = keyof typeof EXTRACT_ITEM_CATEGORIES;

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

export const DUPLICATE_EXTRACT_ERROR_CODE = 'RM-0034';
export const EXTRACT_CONFIRMATION_COOLDOWN_SECONDS = 3;
