// src/components/Modals/ExtractBatchModal/styles.ts
import styled from 'styled-components';
import { Form, Modal, Collapse } from 'antd';

export const WideModal = styled(Modal)`
    .ant-modal-content {
        border-radius: ${({ theme }) => theme.radii?.lg || '12px'};
        padding: ${({ theme }) => theme.space?.[4] || 24}px;
        display: flex;
        flex-direction: column;
    }

    .ant-modal-body {
        flex: 1;
        overflow: hidden;
        margin-top: ${({ theme }) => theme.space?.[3] || 16}px;
    }
`;

export const SplitLayout = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.space?.[4] || 24}px;
    height: 100vh;
`;

// ================= PANE ESQUERDO (PDF) =================
export const LeftPane = styled.div`
    flex: 1;
    background-color: ${({ theme }) => theme.colors?.slate2 || '#f8f9fa'};
    border-radius: ${({ theme }) => theme.radii?.md || '8px'};
    border: 1px dashed ${({ theme }) => theme.colors?.slate5 || '#dee2e6'};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden; /* Garante que o PDF não vaze o border-radius */
    position: relative;

    iframe {
        width: 100%;
        height: 100%; /* Alterado de 80vh para 100% */
        border: none;
        display: block; /* Remove o espaço fantasma que os browsers dão a iframes inline */
    }
`;

export const FloatingUploadButton = styled.div`
    position: absolute;
    bottom: 16px;
    right: 16px;
    z-index: 5;
`;

export const DraggerWrapper = styled.div`
    width: 100%;
    height: 100%;

    .ant-upload-drag {
        height: 100% !important;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent !important;
        border: none !important;
    }
`;

// ================= PANE DIREITO (FORMULÁRIO) =================
export const RightPane = styled.div`
    flex: 1.2; /* Um pouco mais largo para acomodar os campos */
    overflow-y: auto;
    padding-right: ${({ theme }) => theme.space?.[2] || 8}px;

    &::-webkit-scrollbar {
        width: 6px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: ${({ theme }) => theme.colors?.slate4 || '#ced4da'};
        border-radius: ${({ theme }) => theme.radii?.sm || '4px'};
    }
`;

export const StickySummaryCard = styled.div`
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: rgba(248, 249, 250, 0.95);
    border: 1px solid ${({ theme }) => theme.colors?.slate5 || '#dee2e6'};
    border-radius: ${({ theme }) => theme.radii?.md || '8px'};
    padding: 12px 16px;
    margin-bottom: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
    backdrop-filter: blur(8px);
`;

export const SummaryItem = styled.div`
    display: flex;
    flex-direction: column;

    .label {
        font-size: 11px;
        color: ${({ theme }) => theme.colors?.slate10 || '#868e96'};
        text-transform: uppercase;
        font-weight: 600;
        letter-spacing: 0.5px;
    }

    .value {
        font-size: 16px;
        font-weight: 700;
        color: ${({ theme }) => theme.colors?.slate12 || '#212529'};

        &.positive {
            color: ${({ theme }) => theme.colors?.green9 || '#40c057'};
            font-size: 18px;
        }
        &.negative {
            color: ${({ theme }) => theme.colors?.red9 || '#fa5252'};
        }
    }
`;

// ================= ITENS DO FORMULÁRIO =================
export const StyledCollapse = styled(Collapse)`
    background-color: transparent;
    border: none;

    .ant-collapse-item {
        background-color: white;
        border: 1px solid ${({ theme }) => theme.colors?.slate5 || '#dee2e6'};
        border-radius: 8px !important;
        margin-bottom: 12px;
        overflow: hidden;
    }

    .ant-collapse-header {
        align-items: center !important;
        font-weight: 600;
    }
`;

export const FormRow = styled.div`
    display: flex;
    gap: 16px;
    width: 100%;
`;

export const FlexItem = styled(Form.Item)`
    flex: 1;
    .ant-input-number {
        width: 100%;
    }
`;

export const SectionTitle = styled.div`
    border-bottom: 1px solid ${({ theme }) => theme.colors?.slate4 || '#e9ecef'};
    margin: 16px 0;
    padding-bottom: 8px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors?.slate12 || '#343a40'};
`;
