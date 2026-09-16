// src/components/Modals/ExtractBatchModal/index.tsx
import React, { useState, useEffect } from 'react';
import { Form, Button, message, Tooltip, Collapse } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';

import {
    assertExtractBatch,
    assertExtractItem,
    IExtractBatch,
    IExtractBatchPayload,
    IExtractItemPayload,
    EXTRACT_ITEM_CATEGORIES
} from 'interfaces/extract';
import { ExtractBatchService } from 'services/extract_service';

import { IFormValues, IFormExtract, IFixedItems } from './types';
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
            try {
                assertExtractBatch(initialData);
                const mappedExtracts: IFormExtract[] = initialData.extracts.map(
                    (extract) => {
                        const fixedItems: IFixedItems = {};
                        const dynamicCredits: IExtractItemPayload[] = [];
                        const dynamicDebits: IExtractItemPayload[] = [];

                        extract.items.forEach((item) => {
                            if (
                                EXTRACT_ITEM_CATEGORIES[item.category].kind ===
                                'fixed'
                            ) {
                                fixedItems[item.category] = item.amount;
                            } else if (item.is_credit)
                                dynamicCredits.push({ ...item });
                            else dynamicDebits.push({ ...item });
                        });

                        return {
                            key: extract.key,
                            contract_key: extract.contract.key,
                            month_ref: extract.month_ref,
                            year_ref: extract.year_ref,
                            fixedItems,
                            dynamicCredits, // Injetando as duas listas separadas
                            dynamicDebits
                        };
                    }
                );

                form.setFieldsValue({ extracts: mappedExtracts });
                if (initialData.file_path)
                    setPdfPreviewUrl(initialData.file_path);
            } catch (error) {
                message.error(
                    error instanceof Error
                        ? error.message
                        : 'Estrutura de extrato inválida. Corrija o banco de dados.'
                );
                form.resetFields();
            }
        } else if (isOpen) {
            form.resetFields();
            form.setFieldsValue({
                extracts: [
                    {
                        contract_key: '',
                        month_ref: new Date().getMonth() + 1,
                        year_ref: new Date().getFullYear(),
                        fixedItems: {},
                        dynamicCredits: [],
                        dynamicDebits: []
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
                .map((extract) => {
                    const allItems: IExtractItemPayload[] = [];

                    // 1. Processar itens fixos
                    if (extract.fixedItems) {
                        Object.entries(extract.fixedItems).forEach(
                            ([key, amount]) => {
                                if (amount && amount > 0) {
                                    const category =
                                        key as keyof typeof EXTRACT_ITEM_CATEGORIES;
                                    const rule =
                                        EXTRACT_ITEM_CATEGORIES[category];

                                    allItems.push({
                                        category,
                                        description: rule.description,
                                        amount,
                                        is_credit: rule.is_credit as boolean,
                                        is_withheld_at_source:
                                            rule.is_withheld_at_source as boolean
                                    });
                                }
                            }
                        );
                    }

                    // 2. Processar itens dinâmicos (AGORA LENDO AS DUAS LISTAS)
                    if (extract.dynamicCredits) {
                        extract.dynamicCredits.forEach((item) => {
                            if (item.amount && item.amount > 0) {
                                allItems.push(item);
                            }
                        });
                    }

                    if (extract.dynamicDebits) {
                        extract.dynamicDebits.forEach((item) => {
                            if (item.amount && item.amount > 0) {
                                allItems.push(item);
                            }
                        });
                    }

                    // 3. Validação final
                    allItems.forEach((item, itemIndex) => {
                        assertExtractItem(
                            item,
                            `extracts[${values.extracts.indexOf(
                                extract
                            )}].items[${itemIndex}]`
                        );
                    });

                    return {
                        key: extract.key,
                        contract_key: extract.contract_key,
                        month_ref: extract.month_ref,
                        year_ref: extract.year_ref,
                        items: allItems
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
            message.error(
                error instanceof Error
                    ? error.message
                    : 'Erro ao salvar o lote de repasse.'
            );
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
                    <Form form={form} layout="vertical" onFinish={handleSubmit}>
                        <ExtractBatchTotals />
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
                                                fixedItems: {},
                                                dynamicItems: []
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
