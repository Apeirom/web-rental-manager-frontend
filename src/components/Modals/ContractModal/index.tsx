import React, { useState, useEffect } from 'react';
import {
    Form,
    Input,
    InputNumber,
    Select,
    Button,
    Upload,
    message
} from 'antd';
import {
    PlusOutlined,
    UploadOutlined,
    FilePdfOutlined
} from '@ant-design/icons';
import { IContract, IContractPayload } from 'interfaces/contract';
import { IGuarantee } from 'interfaces/guarantee';
import { ContractService } from 'services/contract_service';
import { parseCurrencyInput } from 'utils/formatters';

// Dropdowns
import { TenantDropdown } from '../../Dropdowns/TenantDropdown';
import { PropertyDropdown } from '../../Dropdowns/PropertyDropdown';
import { RealEstateDropdown } from '../../Dropdowns/RealEstateDropdown';
import { GuaranteeDropdown } from '../../Dropdowns/GuaranteeDropdown';

// Modais
import { TenantModal } from '../TenantModal';
import { PropertyModal } from '../PropertyModal';
import { RealEstateModal } from '../RealEstateModal';
import { GuaranteeModal } from '../GuaranteeModal';

import {
    WideModal,
    SplitLayout,
    LeftPane,
    RightPane,
    DropdownRow
} from './styles';

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
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
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

    // Quando o modal de garantia salvar com sucesso
    const handleGuaranteeSuccess = (newGuarantee?: IGuarantee) => {
        if (newGuarantee) {
            setPreloadedGuarantee(newGuarantee); // Injeta no dropdown

            // Troca o seletor visual e a chave da garantia no mesmo momento
            form.setFieldsValue({
                guarantee_type: newGuarantee.type,
                guarantee_key: newGuarantee.key
            });

            setReloadGuaranteeDropdown((prev) => prev + 1);
        }
    };

    useEffect(() => {
        if (isOpen && initialData) {
            // Se for Edição, carrega a garantia velha pro Dropdown não se perder
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
    }, [isOpen, initialData, form]);

    const handleFileChange = (info: any) => {
        const file = info.file as File;
        if (file) {
            setSelectedFile(file);
            setPdfPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleClose = () => {
        if (selectedFile && pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
        form.resetFields();
        setSelectedFile(null);
        setPdfPreviewUrl(null);
        onClose();
    };

    const handleSubmit = async (values: IContractPayload) => {
        setLoading(true);
        try {
            let savedContract: IContract;

            if (initialData) {
                savedContract = await ContractService.update(
                    initialData.key,
                    values
                );
                message.success('Contrato atualizado com sucesso!');
            } else {
                savedContract = await ContractService.create(values);
                message.success('Contrato criado com sucesso!');
            }

            if (selectedFile) {
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
                        {pdfPreviewUrl ? (
                            <>
                                <iframe
                                    src={`${pdfPreviewUrl}#toolbar=0`}
                                    title="Documento"
                                />
                                <div
                                    style={{
                                        position: 'absolute',
                                        bottom: 16,
                                        right: 16
                                    }}
                                >
                                    <Upload
                                        beforeUpload={() => false}
                                        showUploadList={false}
                                        onChange={handleFileChange}
                                        accept=".pdf"
                                    >
                                        <Button
                                            icon={<UploadOutlined />}
                                            type="primary"
                                        >
                                            Trocar PDF
                                        </Button>
                                    </Upload>
                                </div>
                            </>
                        ) : (
                            <Upload.Dragger
                                beforeUpload={() => false}
                                showUploadList={false}
                                onChange={handleFileChange}
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
                                    <FilePdfOutlined
                                        style={{
                                            fontSize: 48,
                                            color: '#0e90e2'
                                        }}
                                    />
                                </p>
                                <p className="ant-upload-text">
                                    Clique ou arraste um PDF aqui
                                </p>
                                <p className="ant-upload-hint">
                                    Anexe o contrato assinado
                                </p>
                            </Upload.Dragger>
                        )}
                    </LeftPane>

                    <RightPane>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                        >
                            <DropdownRow>
                                <Form.Item
                                    name="tenant_key"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Obrigatório'
                                        }
                                    ]}
                                    style={{ marginBottom: 0 }}
                                >
                                    <TenantDropdown label="Inquilino" />
                                </Form.Item>
                                <Button
                                    icon={<PlusOutlined />}
                                    onClick={() => toggleModal('tenant', true)}
                                />
                            </DropdownRow>

                            <DropdownRow>
                                <Form.Item
                                    name="property_key"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Obrigatório'
                                        }
                                    ]}
                                    style={{ marginBottom: 0 }}
                                >
                                    <PropertyDropdown label="Imóvel" />
                                </Form.Item>
                                <Button
                                    icon={<PlusOutlined />}
                                    onClick={() =>
                                        toggleModal('property', true)
                                    }
                                />
                            </DropdownRow>

                            <DropdownRow>
                                <Form.Item
                                    name="real_estate_key"
                                    style={{ marginBottom: 0 }}
                                >
                                    <RealEstateDropdown label="Imobiliária (Opcional)" />
                                </Form.Item>
                                <Button
                                    icon={<PlusOutlined />}
                                    onClick={() =>
                                        toggleModal('realEstate', true)
                                    }
                                />
                            </DropdownRow>

                            <DropdownRow>
                                <Form.Item
                                    name="guarantee_key"
                                    style={{ marginBottom: 0 }}
                                >
                                    <GuaranteeDropdown
                                        label="Garantia"
                                        reloadTrigger={reloadGuaranteeDropdown}
                                        preloadedOption={preloadedGuarantee}
                                    />
                                </Form.Item>

                                <Form.Item name="guarantee_type" hidden>
                                    <Input />
                                </Form.Item>

                                <Button
                                    icon={<PlusOutlined />}
                                    onClick={() =>
                                        toggleModal('guarantee', true)
                                    }
                                />
                            </DropdownRow>

                            <div style={{ display: 'flex', gap: '16px' }}>
                                <Form.Item
                                    label="Valor do Aluguel (R$)"
                                    name="rent_amount"
                                    rules={[{ required: true }]}
                                    style={{ flex: 1 }}
                                >
                                    <InputNumber
                                        min={0}
                                        precision={2}
                                        style={{ width: '100%' }}
                                        decimalSeparator=","
                                        parser={parseCurrencyInput}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Nome do Quarto"
                                    name="room_name"
                                    style={{ flex: 1 }}
                                >
                                    <Input placeholder="Ex: Suíte Master" />
                                </Form.Item>
                            </div>

                            <Form.Item
                                label="Status"
                                name="status"
                                initialValue="active"
                                rules={[{ required: true }]}
                            >
                                <Select
                                    options={[
                                        { value: 'active', label: 'Ativo' },
                                        { value: 'inactive', label: 'Inativo' }
                                    ]}
                                />
                            </Form.Item>
                        </Form>
                    </RightPane>
                </SplitLayout>
            </WideModal>

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
