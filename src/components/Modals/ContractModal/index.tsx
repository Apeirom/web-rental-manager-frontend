import React, { useState, useEffect } from 'react';
import { Form, message } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';

import { IContract, IContractPayload } from 'interfaces/contract';
import { IGuarantee } from 'interfaces/guarantee';
import { ContractService } from 'services/contract_service';

// Modais Externos
import { TenantModal } from '../TenantModal';
import { PropertyModal } from '../PropertyModal';
import { RealEstateModal } from '../RealEstateModal';
import { GuaranteeModal } from '../GuaranteeModal';

// Subcomponentes
import { PdfUploader } from './PdfUploader';
import { ContractFormFields } from './ContractFormFields';

import { WideModal, SplitLayout, LeftPane, RightPane } from './styles';

interface ContractModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    initialData?: IContract | null;
}

export const ContractModal: React.FC<ContractModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    initialData
}) => {
    const [form] = Form.useForm<
        IContractPayload & { guarantee_type?: string }
    >();
    const [loading, setLoading] = useState(false);

    // Estados do Arquivo e Correção do Bug
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
    const [isNewFile, setIsNewFile] = useState<boolean>(false);

    // Estados dos Dropdowns e Modais Auxiliares
    const [reloadGuaranteeDropdown, setReloadGuaranteeDropdown] = useState(0);
    const [preloadedGuarantee, setPreloadedGuarantee] =
        useState<IGuarantee | null>(null);
    const [modals, setModals] = useState({
        tenant: false,
        property: false,
        realEstate: false,
        guarantee: false
    });

    const toggleModal = (modalName: keyof typeof modals, state: boolean) => {
        setModals((prev) => ({ ...prev, [modalName]: state }));
    };

    const handleGuaranteeSuccess = (newGuarantee?: IGuarantee) => {
        if (newGuarantee) {
            setPreloadedGuarantee(newGuarantee);
            form.setFieldsValue({
                guarantee_type: newGuarantee.type,
                guarantee_key: newGuarantee.key
            });
            setReloadGuaranteeDropdown((prev) => prev + 1);
        }
    };

    useEffect(() => {
        if (isOpen && initialData) {
            if (initialData.guarantee) {
                setPreloadedGuarantee(initialData.guarantee);
            }

            form.setFieldsValue({
                guarantee_type: initialData.guarantee
                    ? initialData.guarantee.type
                    : 'none',
                rent_amount: initialData.rent_amount,
                room_name: initialData.room_name,
                status: initialData.status,
                property_key: initialData.property.key,
                tenant_key: initialData.tenant.key,
                real_estate_key: initialData.real_estate?.key,
                guarantee_key: initialData.guarantee?.key
            });

            if (initialData.file_path) {
                setPdfPreviewUrl(initialData.file_path);
            }
        } else if (isOpen) {
            form.resetFields();
            form.setFieldsValue({ guarantee_type: 'none', status: 'active' });
            setPreloadedGuarantee(null);
            setSelectedFile(null);
            setPdfPreviewUrl(null);
        }

        // Reseta a flag de novo arquivo ao abrir o modal
        setIsNewFile(false);
    }, [isOpen, initialData, form]);

    const handleFileChange = (info: UploadChangeParam<UploadFile> | any) => {
        const file = info.file as unknown as File;
        if (file) {
            setSelectedFile(file);
            setPdfPreviewUrl(URL.createObjectURL(file));
            setIsNewFile(true); // Sinaliza que o usuário modificou o arquivo
        }
    };

    const handleRemoveFile = () => {
        if (selectedFile && pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
        setSelectedFile(null);
        setPdfPreviewUrl(null);
        setIsNewFile(true); // Sinaliza que o usuário modificou (removeu) o arquivo
    };

    const handleClose = () => {
        if (
            selectedFile &&
            pdfPreviewUrl &&
            !initialData?.file_path?.includes(pdfPreviewUrl)
        ) {
            URL.revokeObjectURL(pdfPreviewUrl);
        }
        form.resetFields();
        setSelectedFile(null);
        setPdfPreviewUrl(null);
        onClose();
    };

    const handleSubmit = async (values: IContractPayload) => {
        setLoading(true);
        try {
            let filePathPayload: string | null | undefined;
            if (isNewFile) {
                filePathPayload = pdfPreviewUrl ? undefined : null;
            }
            const payload: IContractPayload = {
                ...values,
                file_path: filePathPayload
            };

            let savedContract: IContract;

            if (initialData) {
                savedContract = await ContractService.update(
                    initialData.key,
                    payload
                );
                message.success('Contrato atualizado com sucesso!');
            } else {
                savedContract = await ContractService.create(payload);
                message.success('Contrato criado com sucesso!');
            }

            if (isNewFile && selectedFile) {
                await ContractService.uploadDocument(
                    savedContract.key,
                    selectedFile
                );
                message.success('Documento anexado com sucesso!');
            }

            if (onSuccess) onSuccess();
            handleClose();
        } catch (error) {
            message.error('Erro ao processar contrato. Verifique os dados.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <WideModal
                title={initialData ? 'Editar Contrato' : 'Novo Contrato'}
                open={isOpen}
                onCancel={handleClose}
                onOk={() => form.submit()}
                confirmLoading={loading}
                okText="Salvar Contrato"
                cancelText="Cancelar"
                width={1200}
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
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                        >
                            <ContractFormFields
                                toggleModal={toggleModal}
                                reloadGuaranteeDropdown={
                                    reloadGuaranteeDropdown
                                }
                                preloadedGuarantee={preloadedGuarantee}
                            />
                        </Form>
                    </RightPane>
                </SplitLayout>
            </WideModal>

            {/* Modais Externos */}
            <TenantModal
                isOpen={modals.tenant}
                onClose={() => toggleModal('tenant', false)}
            />
            <PropertyModal
                isOpen={modals.property}
                onClose={() => toggleModal('property', false)}
            />
            <RealEstateModal
                isOpen={modals.realEstate}
                onClose={() => toggleModal('realEstate', false)}
            />
            <GuaranteeModal
                isOpen={modals.guarantee}
                onClose={() => toggleModal('guarantee', false)}
                onSuccess={handleGuaranteeSuccess}
            />
        </>
    );
};
