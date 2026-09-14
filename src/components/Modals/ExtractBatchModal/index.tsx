// src/components/Modals/ExtractBatchModal/index.tsx
import React, { useState, useEffect } from 'react';
import { Form, Button, message, Tooltip, Collapse } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';

import { IExtractBatch, IExtractBatchPayload } from 'interfaces/extract';
import { ExtractBatchService } from 'services/extract_service';

import { IFormValues, IFormExtract, IDynamicItem, IPayloadItem } from './types';
import { ExtractPanelHeader } from './ExtractPanelHeader';
import { ExtractBatchTotals } from './ExtractBatchTotals';
import { ExtractItemFields } from './ExtractItemFields';
import { PdfUploader } from './PdfUploader';

import {
    WideModal,
    SplitLayout,
    LeftPane,
    RightPane,
    StyledCollapse
} from './styles';

interface ExtractBatchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    initialData?: IExtractBatch | null;
}

export const ExtractBatchModal: React.FC<ExtractBatchModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    initialData
}) => {
    const [form] = Form.useForm<IFormValues>();
    const [loading, setLoading] = useState<boolean>(false);
    const [activeKeys, setActiveKeys] = useState<string[]>(['0']);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
    const [isNewFile, setIsNewFile] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen && initialData) {
            const mappedExtracts: IFormExtract[] = initialData.extracts.map(
                (ext: any) => {
                    const formExt: Partial<IFormExtract> = {
                        key: ext.key,
                        contract_key: ext.contract?.key || ext.contract_key,
                        month_ref: ext.month_ref,
                        year_ref: ext.year_ref,
                        dynamic_credits: [],
                        dynamic_debits: []
                    };

                    (ext.items || []).forEach((item: IDynamicItem) => {
                        if (item.category === 'rent')
                            formExt.rent_amount = item.amount;
                        else if (item.category === 'penalty')
                            formExt.penalty = item.amount;
                        else if (item.category === 'interest')
                            formExt.interest = item.amount;
                        else if (item.category === 'iptu')
                            formExt.iptu = item.amount;
                        else if (item.category === 'water')
                            formExt.water = item.amount;
                        else if (item.category === 'administration_fee')
                            formExt.administration_fee = item.amount;
                        else if (item.category === 'bank_fee')
                            formExt.bank_fee = item.amount;
                        else if (item.is_credit)
                            formExt.dynamic_credits?.push(item);
                        else formExt.dynamic_debits?.push(item);
                    });

                    return formExt as IFormExtract;
                }
            );

            form.setFieldsValue({ extracts: mappedExtracts });
            if (initialData.file_path) setPdfPreviewUrl(initialData.file_path);
        } else if (isOpen) {
            form.resetFields();
            form.setFieldsValue({
                extracts: [
                    {
                        contract_key: '',
                        month_ref: new Date().getMonth() + 1,
                        year_ref: new Date().getFullYear(),
                        dynamic_credits: [],
                        dynamic_debits: []
                    }
                ]
            });
            setSelectedFile(null);
            setPdfPreviewUrl(null);
        }
        setIsNewFile(false);
    }, [isOpen, initialData, form]);

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

    const handleSubmit = async (values: IFormValues): Promise<void> => {
        setLoading(true);
        try {
            const finalExtracts = values.extracts
                .filter((ext: IFormExtract) =>
                    Boolean(ext && Object.keys(ext).length > 0)
                )
                .map((ext: IFormExtract) => {
                    const items: IPayloadItem[] = [];

                    const addFixed = (
                        amount: number | undefined,
                        cat: string,
                        desc: string,
                        isCredit: boolean,
                        isWithheld: boolean
                    ) => {
                        if (amount && amount > 0) {
                            items.push({
                                category: cat,
                                description: desc,
                                amount,
                                is_credit: isCredit,
                                is_withheld_at_source: isWithheld
                            });
                        }
                    };

                    addFixed(ext.rent_amount, 'rent', 'Aluguel', true, false);
                    addFixed(ext.penalty, 'penalty', 'Multa', true, false);
                    addFixed(ext.interest, 'interest', 'Juros', true, false);
                    addFixed(ext.iptu, 'iptu', 'IPTU', false, false);
                    addFixed(ext.water, 'water', 'Água', false, false);
                    addFixed(
                        ext.administration_fee,
                        'administration_fee',
                        'Taxa de Administração',
                        false,
                        true
                    );
                    addFixed(
                        ext.bank_fee,
                        'bank_fee',
                        'Taxa Bancária',
                        false,
                        true
                    );

                    if (ext.dynamic_credits) {
                        items.push(
                            ...ext.dynamic_credits.map((i) => ({
                                ...i,
                                is_credit: true
                            }))
                        );
                    }

                    if (ext.dynamic_debits) {
                        items.push(
                            ...ext.dynamic_debits.map((i) => ({
                                ...i,
                                is_credit: false
                            }))
                        );
                    }

                    return {
                        key: ext.key,
                        contract_key: ext.contract_key,
                        month_ref: ext.month_ref,
                        year_ref: ext.year_ref,
                        items
                    };
                });

            let filePathPayload: string | null | undefined;
            if (isNewFile) {
                filePathPayload = pdfPreviewUrl ? undefined : null;
            }

            const payload: IExtractBatchPayload = {
                extracts: finalExtracts,
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
                    {/* Componente Extraído e Isolado para cálculos gerais */}
                    <ExtractBatchTotals />

                    <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
                                                    <ExtractPanelHeader
                                                        fieldKey={field.name}
                                                        index={index}
                                                    />
                                                }
                                                extra={
                                                    fields.length > 1 ? (
                                                        <Tooltip title="Remover este extrato do lote">
                                                            <DeleteOutlined
                                                                style={{
                                                                    color: '#fa5252'
                                                                }}
                                                                onClick={(
                                                                    e
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
                                            add({
                                                dynamic_credits: [],
                                                dynamic_debits: []
                                            });
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
