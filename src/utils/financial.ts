// src/utils/financial.ts
import { IFormExtract } from 'components/Modals/ExtractBatchModal/types';
import { EXTRACT_ITEM_CATEGORIES } from 'interfaces/extract';

export const calculateExtractTotals = (extract: Partial<IFormExtract>) => {
    if (!extract) return { adminFee: 0, netTransfer: 0 };
    let adminFee = 0;
    let netTransfer = 0;

    // 1. Fixos
    if (extract.fixedItems) {
        Object.entries(extract.fixedItems).forEach(([key, amount]) => {
            if (amount && amount > 0) {
                const category = key as keyof typeof EXTRACT_ITEM_CATEGORIES;
                const rule = EXTRACT_ITEM_CATEGORIES[category];

                if (category === 'administration_fee') adminFee += amount;
                if (rule.is_withheld_at_source === false) netTransfer += amount;
                else if (rule.is_withheld_at_source === true)
                    netTransfer -= amount;
            }
        });
    }

    // 2. Dinâmicos (Ambas as listas)
    const processDynamic = (item: {
        amount?: number;
        category?: string;
        is_withheld_at_source?: boolean;
    }) => {
        if (item.amount && item.amount > 0) {
            if (item.category === 'administration_fee') adminFee += item.amount;
            if (item.is_withheld_at_source === false)
                netTransfer += item.amount;
            else if (item.is_withheld_at_source === true)
                netTransfer -= item.amount;
        }
    };

    if (extract.dynamicCredits) extract.dynamicCredits.forEach(processDynamic);
    if (extract.dynamicDebits) extract.dynamicDebits.forEach(processDynamic);

    return { adminFee, netTransfer };
};

export const formatBRL = (val: number): string =>
    new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(val || 0);
