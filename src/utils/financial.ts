import { IExtract } from 'interfaces/extract';

export const calculateExtractTotals = (
    values: Partial<IExtract>,
    commissionRate: number
) => {
    const rent = values.rent_amount || 0;
    const penalty = values.penalty || 0;

    const rawAdminFee = (rent + penalty) * commissionRate;
    const adminFee = Math.round(rawAdminFee * 100) / 100;

    const totalRevenues =
        rent +
        (values.iptu || 0) +
        (values.water || 0) +
        (values.maintenance || 0) +
        (values.agreement || 0) +
        penalty +
        (values.interest || 0) +
        (values.other_revenues || 0);

    const rawNetTransfer = totalRevenues - adminFee - (values.bank_fee || 0);
    const netTransfer = Math.round(rawNetTransfer * 100) / 100;

    return { adminFee, netTransfer };
};
