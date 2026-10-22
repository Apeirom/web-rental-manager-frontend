import {
    IIncomeTaxReportParams,
    IIncomeTaxSummary
} from 'interfaces/income_tax_report';
import { api } from './api';

const ROUTE = '/reports/income-tax';

export const IncomeTaxReportService = {
    getSummary: async (
        params: IIncomeTaxReportParams
    ): Promise<IIncomeTaxSummary> => {
        const { data } = await api.get<IIncomeTaxSummary>(`${ROUTE}/summary`, {
            params
        });
        return data;
    },

    exportCsv: async (params: IIncomeTaxReportParams): Promise<Blob> => {
        const { data } = await api.get<Blob>(`${ROUTE}/export`, {
            params,
            responseType: 'blob'
        });
        return data;
    }
};
