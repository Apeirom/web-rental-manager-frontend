import React, { useState, useEffect } from 'react';
import { Form, Button, message, Tooltip, Collapse } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';

import {
    EXTRACT_ITEM_CATEGORIES,
    DUPLICATE_EXTRACT_ERROR_CODE
} from 'constants/extract';
import { IExtractBatch, IExtractBatchPayload } from 'interfaces/extract_batch';
import { IExtractItemPayload } from 'interfaces/extract_item';
import { assertExtractBatch, assertExtractItem } from 'utils/extractValidation';
import { ExtractBatchService } from 'services/extract_service';

import {
    notifyApiError,
    extractApiErrorCode,
    extractApiErrorMessage,
    extractApiErrorData
} from 'utils/error_handler';
import { IFormValues, IFormExtract, IFixedItems } from './types';
import { ExtractPanelHeader } from './ExtractPanelHeader';
import { ExtractBatchTotals } from './ExtractBatchTotals';
import { ExtractItemFields } from './ExtractItemFields';
import { PdfUploader } from './PdfUploader';
import {
    DuplicateExtractModal,
    IDuplicateExtractDetails
} from '../DuplicateExtractModal';

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

    const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
    const [pendingBatchPayload, setPendingBatchPayload] =
        useState<IExtractBatchPayload | null>(null);
    const [conflictDetails, setConflictDetails] =
        useState<IDuplicateExtractDetails | null>(null);
    const [confirmingDuplicate, setConfirmingDuplicate] = useState(false);

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
                            dynamicCredits,
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
        setDuplicateModalOpen(false);
        setPendingBatchPayload(null);
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
        setDuplicateModalOpen(false);
        setPendingBatchPayload(null);
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
        } catch (error: unknown) {
            const errorCode = extractApiErrorCode(error);
            if (errorCode === DUPLICATE_EXTRACT_ERROR_CODE && !initialData) {
                const errorData = extractApiErrorData(error);
                const rawErrorMsg = await extractApiErrorMessage(
                    error,
                    'Extrato duplicado detectado.'
                );
                const detailsPayload = errorData?.details;
                setConflictDetails({
                    tenantName: detailsPayload?.tenant_name as
                        | string
                        | undefined,
                    propertyName: detailsPayload?.property_name as
                        | string
                        | undefined,
                    monthRef: detailsPayload?.month_ref as number | undefined,
                    yearRef: detailsPayload?.year_ref as number | undefined,
                    duplicateType: detailsPayload?.duplicate_type as
                        | 'database'
                        | 'intra_batch'
                        | undefined,
                    rawMessage: errorData?.translation || rawErrorMsg
                });
                const finalExtracts = values.extracts
                    .filter((ext: IFormExtract) =>
                        Boolean(ext && Object.keys(ext).length > 0)
                    )
                    .map((extract) => {
                        const allItems: IExtractItemPayload[] = [];
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
                                            is_credit:
                                                rule.is_credit as boolean,
                                            is_withheld_at_source:
                                                rule.is_withheld_at_source as boolean
                                        });
                                    }
                                }
                            );
                        }
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

                setPendingBatchPayload({
                    extracts: finalExtracts,
                    file_path: filePathPayload
                });
                setDuplicateModalOpen(true);
            } else {
                await notifyApiError(
                    error,
                    'Erro ao salvar o lote de repasse.'
                );
                console.error(error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmDuplicate = async (): Promise<void> => {
        if (!pendingBatchPayload) return;
        setConfirmingDuplicate(true);
        try {
            const confirmedPayload: IExtractBatchPayload = {
                ...pendingBatchPayload,
                confirm_duplicate: true
            };
            const savedBatch = await ExtractBatchService.create(
                confirmedPayload
            );
            message.success('Lote gerado com sucesso!');

            if (isNewFile && selectedFile) {
                await ExtractBatchService.uploadReceipt(
                    savedBatch.key,
                    selectedFile
                );
                message.success('Comprovante anexado ao lote!');
            }

            setDuplicateModalOpen(false);
            setPendingBatchPayload(null);
            if (onSuccess) onSuccess();
            handleClose();
        } catch (error: unknown) {
            await notifyApiError(
                error,
                'Erro ao registrar lote com extratos duplicados.'
            );
        } finally {
            setConfirmingDuplicate(false);
        }
    };

    const handleCloseDuplicateModal = (): void => {
        setDuplicateModalOpen(false);
        setPendingBatchPayload(null);
        setConflictDetails(null);
    };

    return (
        <>
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
                okText="Salvar Lote"
                cancelText="Cancelar"
                width={1200}
                destroyOnHidden
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
                        <ExtractBatchTotals />

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                        >
                            <Form.List name="extracts">
                                {(fields, { add, remove }) => (
                                    <>
                                        <StyledCollapse
                                            activeKey={activeKeys}
                                            onChange={(keys) =>
                                                setActiveKeys(
                                                    Array.isArray(keys)
                                                        ? keys
                                                        : [keys]
                                                )
                                            }
                                        >
                                            {fields.map(({ key, name }) => (
                                                <Collapse.Panel
                                                    key={key.toString()}
                                                    header={
                                                        <ExtractPanelHeader
                                                            fieldKey={name}
                                                            index={name}
                                                        />
                                                    }
                                                    extra={
                                                        fields.length > 1 && (
                                                            <Tooltip title="Remover este extrato do lote">
                                                                <Button
                                                                    type="text"
                                                                    danger
                                                                    icon={
                                                                        <DeleteOutlined />
                                                                    }
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        remove(
                                                                            name
                                                                        );
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                        )
                                                    }
                                                >
                                                    <ExtractItemFields
                                                        fieldKey={name}
                                                    />
                                                </Collapse.Panel>
                                            ))}
                                        </StyledCollapse>

                                        <Button
                                            type="dashed"
                                            onClick={() => {
                                                add({
                                                    contract_key: '',
                                                    month_ref:
                                                        new Date().getMonth() +
                                                        1,
                                                    year_ref:
                                                        new Date().getFullYear(),
                                                    fixedItems: {},
                                                    dynamicCredits: [],
                                                    dynamicDebits: []
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

            <DuplicateExtractModal
                isOpen={duplicateModalOpen}
                onClose={handleCloseDuplicateModal}
                onConfirm={handleConfirmDuplicate}
                details={conflictDetails}
                loading={confirmingDuplicate}
            />
        </>
    );
};
