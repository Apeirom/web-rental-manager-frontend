import styled from 'styled-components';
import { Modal } from 'antd';

export const StyledModal = styled(Modal)`
    .ant-modal-content {
        border-radius: ${({ theme }) => theme.radii.lg};
        padding: ${({ theme }) => theme.space[4]}px;
    }

    .ant-modal-header {
        margin-bottom: ${({ theme }) => theme.space[4]}px;
    }

    .ant-modal-title {
        color: ${({ theme }) => theme.colors.slate10};
        font-size: ${({ theme }) => theme.fontSizes.lg};
        font-weight: ${({ theme }) => theme.fontWeights.bold};
    }

    /* Ajuste para os botões do rodapé combinarem com o tema */
    .ant-btn-primary {
        background-color: ${({ theme }) => theme.colors.blue6};
        border-radius: ${({ theme }) => theme.radii.md};

        &:hover {
            background-color: ${({ theme }) => theme.colors.blue7} !important;
        }
    }

    .ant-btn-default {
        border-radius: ${({ theme }) => theme.radii.md};
    }
`;
