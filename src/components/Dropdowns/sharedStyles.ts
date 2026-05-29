import styled from 'styled-components';

export const SelectContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.space[1]}px;
    width: 100%;

    /* Sobrescrevendo a cor principal do Ant Design para usar o nosso Azul */
    .ant-select-selector {
        border-radius: ${({ theme }) => theme.radii.md};
        border-color: ${({ theme }) => theme.colors.slate4} !important;
    }

    .ant-select-focused .ant-select-selector,
    .ant-select-selector:hover {
        border-color: ${({ theme }) => theme.colors.blue6} !important;
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.blue2} !important;
    }
`;

export const Label = styled.label`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    color: ${({ theme }) => theme.colors.onSurface.highEmphasis};
`;
