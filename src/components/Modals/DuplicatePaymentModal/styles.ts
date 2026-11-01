import styled from 'styled-components';
import { Modal, Button } from 'antd';

export const StyledModal = styled(Modal)`
    .ant-modal-content {
        border-radius: ${({ theme }) => theme.radii.lg};
        padding: ${({ theme }) => theme.space[4]}px;
    }

    .ant-modal-header {
        margin-bottom: ${({ theme }) => theme.space[3]}px;
    }

    .ant-modal-title {
        color: ${({ theme }) => theme.colors.slate10};
        font-size: ${({ theme }) => theme.fontSizes.lg};
        font-weight: ${({ theme }) => theme.fontWeights.bold};
    }
`;

export const ModalBody = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.space[3]}px;
`;

export const WarningMessage = styled.p`
    color: ${({ theme }) => theme.colors.slate9};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    line-height: 1.5;
    margin: 0;
`;

export const DetailsCard = styled.div`
    background-color: ${({ theme }) => theme.colors.slate2};
    border: 1px solid ${({ theme }) => theme.colors.slate4};
    border-radius: ${({ theme }) => theme.radii.md};
    padding: ${({ theme }) => theme.space[3]}px;
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.space[1]}px;
`;

export const DetailRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const DetailLabel = styled.span`
    color: ${({ theme }) => theme.colors.slate8};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

export const DetailValue = styled.span`
    color: ${({ theme }) => theme.colors.slate10};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

export const FooterContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: ${({ theme }) => theme.space[2]}px;
    margin-top: ${({ theme }) => theme.space[4]}px;
`;

export const ConfirmButton = styled(Button)`
    background-color: ${({ theme }) => theme.colors.blue6};
    border-color: ${({ theme }) => theme.colors.blue6};
    color: ${({ theme }) => theme.colors.white};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    border-radius: ${({ theme }) => theme.radii.md};

    &:hover:not(:disabled) {
        background-color: ${({ theme }) => theme.colors.blue7} !important;
        border-color: ${({ theme }) => theme.colors.blue7} !important;
        color: ${({ theme }) => theme.colors.white} !important;
    }

    &:disabled {
        background-color: ${({ theme }) => theme.colors.slate4} !important;
        border-color: ${({ theme }) => theme.colors.slate4} !important;
        color: ${({ theme }) => theme.colors.slate7} !important;
        cursor: not-allowed;
    }
`;

export const CancelButton = styled(Button)`
    border-radius: ${({ theme }) => theme.radii.md};
`;
