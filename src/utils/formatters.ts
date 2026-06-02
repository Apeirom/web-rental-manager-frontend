/**
 * Utilitário para o Ant Design InputNumber.
 * Converte a vírgula digitada pelo usuário em ponto para que o formulário
 * reconheça o valor corretamente como decimal.
 */
export const parseCurrencyInput = (value: string | undefined): number => {
    return (value ? value.replace(/,/g, '.') : '') as unknown as number;
};

/**
 * Adiciona o símbolo de porcentagem para exibição no InputNumber.
 */
export const formatPercentageInput = (
    value: number | string | undefined
): string => {
    return value !== undefined && value !== null ? `${value}%` : '';
};

/**
 * Remove o símbolo de porcentagem e converte vírgula para ponto no InputNumber.
 */
export const parsePercentageInput = (value: string | undefined): number => {
    if (!value) return '' as unknown as number;
    return value.replace('%', '').replace(/,/g, '.') as unknown as number;
};

/**
 * Converte a porcentagem que vem do banco de dados (ex: 0.1) para exibição amigável (ex: 10)
 */
export const fromApiPercentage = (value: number): number => {
    return Number((value * 100).toFixed(2));
};

/**
 * Converte a porcentagem amigável do formulário (ex: 10) para o padrão do banco de dados (ex: 0.1)
 */
export const toApiPercentage = (value: number): number => {
    return Number((value / 100).toFixed(4));
};
