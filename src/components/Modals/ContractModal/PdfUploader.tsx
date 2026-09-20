import React from 'react';
import { Button, Upload, Tooltip, Space } from 'antd';
import {
    UploadOutlined,
    FilePdfOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';

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
                    title="Documento"
                    style={{ width: '100%', height: '100%', border: 'none' }}
                />
                <div style={{ position: 'absolute', bottom: 16, right: 16 }}>
                    <Space>
                        <Upload
                            beforeUpload={() => false}
                            showUploadList={false}
                            onChange={onFileChange as any}
                            accept=".pdf"
                        >
                            <Button icon={<UploadOutlined />} type="primary">
                                Trocar PDF
                            </Button>
                        </Upload>
                        <Tooltip title="Remover PDF">
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={onRemoveFile}
                            />
                        </Tooltip>
                    </Space>
                </div>
            </>
        );
    }

    return (
        <Upload.Dragger
            beforeUpload={() => false}
            showUploadList={false}
            onChange={onFileChange as any}
            accept=".pdf"
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <p className="ant-upload-drag-icon">
                <FilePdfOutlined style={{ fontSize: 48, color: '#0e90e2' }} />
            </p>
            <p className="ant-upload-text">Clique ou arraste um PDF aqui</p>
            <p className="ant-upload-hint">Anexe o contrato assinado</p>
        </Upload.Dragger>
    );
};
