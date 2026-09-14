import { IFormExtract } from 'components/Modals/ExtractBatchModal/types';

export const calculateExtractTotals = (extract: Partial<IFormExtract>) => {
    if (!extract) return { adminFee: 0, netTransfer: 0 };

    const safeNum = (val?: number) => Number(val) || 0;

    const adminFee = safeNum(extract.administration_fee);
    let netTransfer = 0;

    // + Receitas (Créditos)
    netTransfer += safeNum(extract.rent_amount);
    netTransfer += safeNum(extract.penalty);
    netTransfer += safeNum(extract.interest);

    if (extract.dynamic_credits) {
        netTransfer += extract.dynamic_credits.reduce(
            (acc, curr) => acc + safeNum(curr.amount),
            0
        );
    }

    // - Despesas (Débitos)
    netTransfer -= safeNum(extract.iptu);
    netTransfer -= safeNum(extract.water);
    netTransfer -= adminFee; // A taxa entra como débito
    netTransfer -= safeNum(extract.bank_fee);

    if (extract.dynamic_debits) {
        netTransfer -= extract.dynamic_debits.reduce(
            (acc, curr) => acc + safeNum(curr.amount),
            0
        );
    }

    return { adminFee, netTransfer };
};

export const formatBRL = (val: number): string =>
    new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(val || 0);
