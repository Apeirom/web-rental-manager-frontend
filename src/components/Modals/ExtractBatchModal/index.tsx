// src/components/Modals/ExtractBatchModal/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, message, Tooltip, Collapse } from 'antd';
import {
    InfoCircleOutlined,
    PlusOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';

import {
    IExtractBatch,
    IExtractBatchPayload,
    IExtractItemPayload
} from 'interfaces/extract';
import { ExtractBatchService } from 'services/extract_service';
import { calculateExtractTotals } from 'utils/financial';

import { PdfUploader } from './PdfUploader';
import { ExtractItemFields } from './ExtractItemFields';
import {
    WideModal,
    SplitLayout,
    LeftPane,
    RightPane,
    StickySummaryCard,
    SummaryItem,
    StyledCollapse
} from './styles';

interface ExtractBatchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    initialData?: IExtractBatch | null;
}

const formatBRL = (val: number): string =>
    new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(val || 0);

export const ExtractBatchModal: React.FC<ExtractBatchModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    initialData
}) => {
    const [form] = Form.useForm<IExtractBatchPayload>();
    const [loading, setLoading] = useState<boolean>(false);
    const [activeKeys, setActiveKeys] = useState<string[]>(['0']);

    // Estados do PDF
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
    const [isNewFile, setIsNewFile] = useState<boolean>(false);

    // Estados Financeiros (Soma Total do Lote)
    const [batchPreview, setBatchPreview] = useState({
        adminFee: 0,
        netTransfer: 0
    });

    // Função para recalcular os totais utilizando o utils de financials
    const recalculateBatchTotals = useCallback(
        (
            currentExtracts: IExtractItemPayload[],
            sourceData?: IExtractBatch | null
        ) => {
            if (!currentExtracts) return;

            let totalAdminFee = 0;
            let totalNetTransfer = 0;

            currentExtracts.forEach((ext, index) => {
                if (!ext) return;

                const commissionRate =
                    sourceData?.extracts?.[index]?.contract?.real_estate
                        ?.commission || 0.1;

                const { adminFee, netTransfer } = calculateExtractTotals(
                    ext,
                    commissionRate
                );

                totalAdminFee += adminFee;
                totalNetTransfer += netTransfer;
            });

            setBatchPreview({
                adminFee: totalAdminFee,
                netTransfer: totalNetTransfer
            });
        },
        []
    );

    useEffect(() => {
        if (isOpen && initialData) {
            const mappedExtracts: IExtractItemPayload[] =
                initialData.extracts.map((ext) => ({
                    key: ext.key,
                    contract_key: ext.contract.key,
                    month_ref: ext.month_ref,
                    year_ref: ext.year_ref,
                    rent_amount: ext.rent_amount,
                    iptu: ext.iptu,
                    water: ext.water,
                    maintenance: ext.maintenance,
                    agreement: ext.agreement,
                    penalty: ext.penalty,
                    interest: ext.interest,
                    other_revenues: ext.other_revenues,
                    bank_fee: ext.bank_fee
                }));

            form.setFieldsValue({ extracts: mappedExtracts });
            if (initialData.file_path) setPdfPreviewUrl(initialData.file_path);

            recalculateBatchTotals(mappedExtracts, initialData);
        } else if (isOpen) {
            form.resetFields();
            // Tipagem correta sem uso de 'as any'
            form.setFieldsValue({ extracts: [{}] as IExtractItemPayload[] });
            setSelectedFile(null);
            setPdfPreviewUrl(null);
            setBatchPreview({ adminFee: 0, netTransfer: 0 });
        }
        setIsNewFile(false);
    }, [isOpen, initialData, form, recalculateBatchTotals]);

    const handleValuesChange = (
        _: unknown,
        allValues: IExtractBatchPayload
    ): void => {
        recalculateBatchTotals(allValues.extracts, initialData);
    };

    const handleFileChange = (info: UploadChangeParam<UploadFile>): void => {
        const file = info.file as unknown as File;
        if (file) {
            setSelectedFile(file);
            setPdfPreviewUrl(URL.createObjectURL(file));
            setIsNewFile(true);
        }
    };

    const handleRemoveFile = (): void => {
        if (selectedFile && pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
        setSelectedFile(null);
        setPdfPreviewUrl(null);
        setIsNewFile(true);
    };

    const handleClose = (): void => {
        if (
            selectedFile &&
            pdfPreviewUrl &&
            !initialData?.file_path?.includes(pdfPreviewUrl)
        ) {
            URL.revokeObjectURL(pdfPreviewUrl);
        }
        form.resetFields();
        onClose();
    };

    const handleSubmit = async (
        values: IExtractBatchPayload
    ): Promise<void> => {
        setLoading(true);
        try {
            const cleanExtracts = values.extracts
                .filter((ext): ext is IExtractItemPayload =>
                    Boolean(ext && Object.keys(ext).length > 0)
                )
                .map((ext) => ({
                    ...ext,
                    rent_amount: ext.rent_amount || 0,
                    iptu: ext.iptu || 0,
                    water: ext.water || 0,
                    maintenance: ext.maintenance || 0,
                    agreement: ext.agreement || 0,
                    penalty: ext.penalty || 0,
                    interest: ext.interest || 0,
                    other_revenues: ext.other_revenues || 0,
                    bank_fee: ext.bank_fee || 0
                }));

            let filePathPayload: string | undefined | null;

            if (isNewFile) {
                filePathPayload = undefined;
            } else if (!pdfPreviewUrl) {
                filePathPayload = null;
            } else {
                filePathPayload = undefined;
            }

            const payload: IExtractBatchPayload = {
                extracts: cleanExtracts,
                file_path: filePathPayload
            };

            let savedBatch: IExtractBatch;

            if (initialData) {
                savedBatch = await ExtractBatchService.update(
                    initialData.key,
                    payload
                );
                message.success('Lote atualizado com sucesso!');
            } else {
                savedBatch = await ExtractBatchService.create(payload);
                message.success('Lote gerado com sucesso!');
            }

            if (isNewFile && selectedFile) {
                await ExtractBatchService.uploadReceipt(
                    savedBatch.key,
                    selectedFile
                );
                message.success('Comprovante anexado ao lote!');
            }

            if (onSuccess) onSuccess();
            handleClose();
        } catch (error) {
            message.error('Erro ao salvar o lote de repasse.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <WideModal
            title={
                initialData
                    ? 'Editar Lote de Repasse'
                    : 'Novo Lote de Repasse (Múltiplos)'
            }
            open={isOpen}
            onCancel={handleClose}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okText="Salvar Lote Inteiro"
            cancelText="Cancelar"
            width={1050}
            destroyOnHidden
            centered
        >
            <SplitLayout>
                <LeftPane>
                    <PdfUploader
                        pdfPreviewUrl={pdfPreviewUrl}
                        onFileChange={handleFileChange}
                        onRemoveFile={handleRemoveFile}
                    />
                </LeftPane>

                <RightPane>
                    <StickySummaryCard>
                        <SummaryItem>
                            <span className="label">
                                Taxa Adm (Soma do Lote)
                                <Tooltip title="Calculada sobre o Aluguel + Multa de todos os extratos">
                                    <InfoCircleOutlined
                                        style={{
                                            marginLeft: 4,
                                            cursor: 'help'
                                        }}
                                    />
                                </Tooltip>
                            </span>
                            <span className="value negative">
                                - {formatBRL(batchPreview.adminFee)}
                            </span>
                        </SummaryItem>
                        <SummaryItem style={{ alignItems: 'flex-end' }}>
                            <span className="label">
                                Líquido Total Esperado
                            </span>
                            <span className="value positive">
                                {formatBRL(batchPreview.netTransfer)}
                            </span>
                        </SummaryItem>
                    </StickySummaryCard>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        onValuesChange={handleValuesChange}
                    >
                        <Form.List name="extracts">
                            {(fields, { add, remove }) => (
                                <>
                                    <StyledCollapse
                                        activeKey={activeKeys}
                                        onChange={(keys) =>
                                            setActiveKeys(keys as string[])
                                        }
                                    >
                                        {fields.map((field, index) => (
                                            <Collapse.Panel
                                                key={field.key.toString()}
                                                forceRender
                                                header={
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            justifyContent:
                                                                'space-between',
                                                            width: '100%',
                                                            alignItems: 'center'
                                                        }}
                                                    >
                                                        <span>
                                                            <strong>
                                                                Extrato{' '}
                                                                {index + 1}
                                                            </strong>
                                                        </span>
                                                    </div>
                                                }
                                                extra={
                                                    fields.length > 1 ? (
                                                        <Tooltip title="Remover este extrato do lote">
                                                            <DeleteOutlined
                                                                style={{
                                                                    color: '#fa5252'
                                                                }}
                                                                onClick={(
                                                                    e: React.MouseEvent<HTMLSpanElement>
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    remove(
                                                                        field.name
                                                                    );
                                                                }}
                                                            />
                                                        </Tooltip>
                                                    ) : null
                                                }
                                            >
                                                <ExtractItemFields
                                                    fieldKey={field.name}
                                                />
                                            </Collapse.Panel>
                                        ))}
                                    </StyledCollapse>

                                    <Button
                                        type="dashed"
                                        onClick={() => {
                                            add();
                                            setActiveKeys([
                                                ...activeKeys,
                                                fields.length.toString()
                                            ]);
                                        }}
                                        block
                                        icon={<PlusOutlined />}
                                        style={{ marginTop: 16 }}
                                    >
                                        Adicionar outro contrato a este lote
                                    </Button>
                                </>
                            )}
                        </Form.List>
                    </Form>
                </RightPane>
            </SplitLayout>
        </WideModal>
    );
};
