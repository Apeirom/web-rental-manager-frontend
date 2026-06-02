import styled from 'styled-components';
import { Layout } from 'antd';

const { Sider } = Layout;

export const StyledSider = styled(Sider)`
    /* Sobrescrevendo a cor padrão (escura) do Antd para o nosso tema claro */
    background-color: ${({ theme }) => theme.colors.white} !important;
    border-right: 1px solid ${({ theme }) => theme.colors.slate4};

    /* Garante que o menu ocupe a tela toda e fique fixo na esquerda */
    height: 100vh;
    position: sticky;
    top: 0;
    left: 0;

    /* Transforma o container interno em Flexbox para empurrar o botão Sair para baixo */
    .ant-layout-sider-children {
        display: flex;
        flex-direction: column;
    }
`;

export const UserInfoContainer = styled.div`
    padding: ${({ theme }) => theme.space[4]}px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.slate4};
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.space[1]}px;
    background-color: ${({ theme }) => theme.colors.slate1};
`;

export const UserEmail = styled.span`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.slate9};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    word-break: break-all;
`;

export const MenuContainer = styled.div`
    flex: 1; /* Ocupa todo o espaço disponível no meio */
    overflow-y: auto;
    padding-top: ${({ theme }) => theme.space[3]}px;

    /* Removendo a borda direita nativa do Menu do Antd */
    .ant-menu-light {
        border-inline-end: none !important;
    }

    /* Estilizando o item ativo com a nossa cor principal */
    .ant-menu-item-selected {
        background-color: ${({ theme }) => theme.colors.blue1} !important;
        color: ${({ theme }) => theme.colors.blue6} !important;
        font-weight: ${({ theme }) => theme.fontWeights.medium};
    }
`;

export const LogoutContainer = styled.div`
    padding: ${({ theme }) => theme.space[4]}px;
    border-top: 1px solid ${({ theme }) => theme.colors.slate4};

    button {
        width: 100%;
        display: flex;
        align-items: center;
        gap: ${({ theme }) => theme.space[2]}px;
        background: none;
        border: none;
        color: ${({ theme }) => theme.colors.danger};
        font-size: ${({ theme }) => theme.fontSizes.md};
        font-weight: ${({ theme }) => theme.fontWeights.medium};
        cursor: pointer;
        transition: ${({ theme }) => theme.transitions.fast};
        padding: ${({ theme }) => theme.space[2]}px;
        border-radius: ${({ theme }) => theme.radii.md};

        &:hover {
            background-color: ${({ theme }) => theme.colors.slate2};
        }
    }
`;

export const ComingSoonBadge = styled.span`
    font-size: 10px;
    display: flex;
    align-items: center;
    height: 22px;
    background-color: ${({ theme }) => theme.colors.slate3};
    color: ${({ theme }) => theme.colors.slate9};
    padding: 2px 6px;
    border-radius: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;
