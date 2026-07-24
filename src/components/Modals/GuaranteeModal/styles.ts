import styled from 'styled-components';
import { Modal } from 'antd';

export const StyledModal = styled(Modal)`
    .ant-modal-content {
        border-radius: ${({ theme }) => theme.radii.lg};
        padding: ${({ theme }) => theme.space[4]}px;
    }
`;

export const DynamicFormArea = styled.div`
    background-color: ${({ theme }) => theme.colors.slate2};
    border-radius: ${({ theme }) => theme.radii.md};
    border: 1px solid ${({ theme }) => theme.colors.slate5};
    padding: ${({ theme }) => theme.space[4]}px;

    animation: fadeIn 0.3s ease-in-out;

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(5px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

export const SectionTitle = styled.h4`
    margin-top: 0;
    margin-bottom: ${({ theme }) => theme.space[3]}px;
    color: ${({ theme }) => theme.colors.slate11};
    font-size: ${({ theme }) => theme.fontSizes.md};
    font-weight: 600;
`;
