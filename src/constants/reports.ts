export const INCOME_TAX_DEFAULT_PERIOD_DAYS = 90;
export const INCOME_TAX_TABLE_PAGE_SIZE = 10;
export const INCOME_TAX_TENANT_TYPE_PF = 'PF';
export const INCOME_TAX_TENANT_TYPE_PJ = 'PJ';
export const INCOME_TAX_TENANT_TYPE_BOTH = 'BOTH';

export type IncomeTaxTenantType =
    | typeof INCOME_TAX_TENANT_TYPE_PF
    | typeof INCOME_TAX_TENANT_TYPE_PJ
    | typeof INCOME_TAX_TENANT_TYPE_BOTH;

export const INCOME_TAX_TENANT_TYPE_OPTIONS = [
    { label: 'Pessoa Física (PF)', value: INCOME_TAX_TENANT_TYPE_PF },
    { label: 'Pessoa Jurídica (PJ)', value: INCOME_TAX_TENANT_TYPE_PJ },
    { label: 'Ambos', value: INCOME_TAX_TENANT_TYPE_BOTH }
];
