import styled from 'styled-components';

export const Container = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    /* Gradiente sutil do azul clarinho para o cinza claro do nosso tema */
    background: linear-gradient(
        135deg,
        ${({ theme }) => theme.colors.blue1} 0%,
        ${({ theme }) => theme.colors.slate2} 100%
    );
    padding: ${({ theme }) => theme.space[4]}px;
`;

export const FormCard = styled.div`
    background-color: ${({ theme }) => theme.colors.white};
    width: 100%;
    max-width: 420px;
    padding: ${({ theme }) => theme.space[6]}px;
    border-radius: ${({ theme }) => theme.radii.lg};
    box-shadow: ${({ theme }) => theme.shadows.lg};

    /* Personalizando os inputs do Ant Design para ficarem maiores e mais clicáveis */
    .ant-input-affix-wrapper {
        padding: 12px 16px;
        border-radius: ${({ theme }) => theme.radii.md};
    }

    .ant-btn {
        height: 48px;
        border-radius: ${({ theme }) => theme.radii.md};
        font-size: ${({ theme }) => theme.fontSizes.md};
        font-weight: ${({ theme }) => theme.fontWeights.medium};
    }
`;

export const Header = styled.div`
    text-align: center;
    margin-bottom: ${({ theme }) => theme.space[6]}px;
`;

export const Title = styled.h1`
    color: ${({ theme }) => theme.colors.slate10};
    font-size: ${({ theme }) => theme.fontSizes.xl};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    margin-bottom: ${({ theme }) => theme.space[2]}px;

    span {
        color: ${({ theme }) => theme.colors.blue6};
    }
`;

export const Subtitle = styled.p`
    color: ${({ theme }) => theme.colors.onSurface.lowEmphasis};
    font-size: ${({ theme }) => theme.fontSizes.sm};
`;
