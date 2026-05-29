import { IIncomeTaxRow } from 'interfaces/analysis';
import { api } from './api';

const ROUTE = '/analyses';

export const AnalysisService = {
    getIncomeTax: async (
        startYear: number,
        startMonth: number,
        endYear: number,
        endMonth: number
    ): Promise<IIncomeTaxRow[]> => {
        const { data } = await api.get<IIncomeTaxRow[]>(`${ROUTE}/income-tax`, {
            params: {
                start_year: startYear,
                start_month: startMonth,
                end_year: endYear,
                end_month: endMonth
            }
        });
        return data;
    }
};
