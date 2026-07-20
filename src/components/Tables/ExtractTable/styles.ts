// src/pages/Extracts/styles.ts (ou o caminho onde fica sua tabela)
import styled from 'styled-components';
import { TableContainer, Toolbar, FiltersArea } from '../sharedStyles';

export { TableContainer, Toolbar, FiltersArea };

export const InfoStack = styled.div`
    display: flex;
    flex-direction: column;

    .primary-text {
        font-weight: 600;
        color: ${({ theme }) => theme.colors?.slate12 || '#212529'};
    }

    .secondary-text {
        font-size: 12px;
        color: ${({ theme }) => theme.colors?.slate10 || '#868e96'};
    }
`;

export const MoneyText = styled.span<{ $variant?: 'positive' | 'neutral' }>`
    font-weight: ${({ $variant }) => ($variant === 'positive' ? '700' : '500')};
    color: ${({ theme, $variant }) =>
        $variant === 'positive'
            ? theme.colors?.green9 || '#40c057'
            : theme.colors?.slate11 || '#495057'};
`;

export const ExpandedTableWrapper = styled.div`
    padding: ${({ theme }) => theme.space?.[3] || '16px'};
    background-color: ${({ theme }) => theme.colors?.slate2 || '#f8f9fa'};
    border-radius: ${({ theme }) => theme.radii?.md || '8px'};
    margin: 8px 16px 16px 48px;
    border: 1px solid ${({ theme }) => theme.colors?.slate4 || '#ced4da'};

    /* Remove a borda da subtabela para ficar mais clean */
    .ant-table-wrapper {
        border-radius: 8px;
        overflow: hidden;
    }
`;
