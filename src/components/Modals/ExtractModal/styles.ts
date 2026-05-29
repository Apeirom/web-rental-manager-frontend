import styled from 'styled-components';
import { Modal } from 'antd';

export const WideModal = styled(Modal)`
    .ant-modal-content {
        border-radius: ${({ theme }) => theme.radii.lg};
        padding: ${({ theme }) => theme.space[4]}px;
        /* Define uma altura máxima para o modal não vazar da tela */
        height: 85vh;
        display: flex;
        flex-direction: column;
    }

    .ant-modal-body {
        flex: 1;
        overflow: hidden; /* Oculta a barra do modal principal */
        margin-top: ${({ theme }) => theme.space[3]}px;
    }
`;

export const SplitLayout = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.space[4]}px;
    height: 100%;
`;

export const LeftPane = styled.div`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.slate2};
    border-radius: ${({ theme }) => theme.radii.md};
    border: 1px dashed ${({ theme }) => theme.colors.slate5};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;

    iframe {
        width: 100%;
        height: 100%;
        border: none;
    }
`;

export const RightPane = styled.div`
    flex: 1;
    overflow-y: auto;
    padding-right: ${({ theme }) => theme.space[2]}px;

    /* Estilizando a barra de rolagem */
    &::-webkit-scrollbar {
        width: 6px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: ${({ theme }) => theme.colors.slate4};
        border-radius: ${({ theme }) => theme.radii.sm};
    }
`;

export const DropdownRow = styled.div`
    display: flex;
    align-items: flex-end;
    gap: ${({ theme }) => theme.space[2]}px;
    margin-bottom: ${({ theme }) => theme.space[3]}px;

    /* O dropdown ocupa o espaço que sobrar, o botão ocupa o tamanho fixo dele */
    > div:first-child {
        flex: 1;
        margin-bottom: 0 !important;
    }
`;
