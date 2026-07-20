// src/components/Modals/ExtractBatchModal/components/PdfUploader.tsx
import React from 'react';
import { Button, Upload, Tooltip, Space } from 'antd';
import {
    UploadOutlined,
    FilePdfOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { FloatingUploadButton, DraggerWrapper } from './styles';

interface PdfUploaderProps {
    pdfPreviewUrl: string | null;
    onFileChange: (info: UploadChangeParam<UploadFile>) => void;
    onRemoveFile: () => void;
}

export const PdfUploader: React.FC<PdfUploaderProps> = ({
    pdfPreviewUrl,
    onFileChange,
    onRemoveFile
}) => {
    if (pdfPreviewUrl) {
        return (
            <>
                <iframe
                    src={`${pdfPreviewUrl}#toolbar=0`}
                    title="Comprovante"
                />
                <FloatingUploadButton>
                    <Space>
                        <Upload
                            beforeUpload={() => false}
                            showUploadList={false}
                            onChange={onFileChange}
                            accept=".pdf"
                        >
                            <Button icon={<UploadOutlined />} type="primary">
                                Trocar PDF
                            </Button>
                        </Upload>
                        <Tooltip title="Remover Comprovante">
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={onRemoveFile}
                            />
                        </Tooltip>
                    </Space>
                </FloatingUploadButton>
            </>
        );
    }

    return (
        <DraggerWrapper>
            <Upload.Dragger
                beforeUpload={() => false}
                showUploadList={false}
                onChange={onFileChange}
                accept=".pdf"
            >
                <p className="ant-upload-drag-icon">
                    <FilePdfOutlined
                        style={{ fontSize: 48, color: '#0e90e2' }}
                    />
                </p>
                <p className="ant-upload-text">Anexar Comprovante de Repasse</p>
                <p className="ant-upload-hint">Formatos suportados: .PDF</p>
            </Upload.Dragger>
        </DraggerWrapper>
    );
};
