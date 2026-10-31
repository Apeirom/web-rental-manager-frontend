import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, message } from 'antd';
import { RealEstateService } from 'services/real_estate_service';
import { IRealEstatePayload, IRealEstate } from 'interfaces/real_estate';
import { DocumentNumberInput } from 'components/common/DocumentNumberInput';
import {
    formatPercentageInput,
    parsePercentageInput,
    fromApiPercentage,
    toApiPercentage
} from 'utils/formatters';
import { notifyApiError } from 'utils/error_handler';
import { StyledModal } from '../sharedStyles';

interface RealEstateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    initialData?: IRealEstate | null;
}

export const RealEstateModal: React.FC<RealEstateModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    initialData
}) => {
    const [form] = Form.useForm<IRealEstatePayload>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                form.setFieldsValue({
                    name: initialData.name,
                    cnpj: initialData.cnpj,
                    commission: fromApiPercentage(initialData.commission),
                    address: initialData.address,
                    phone: initialData.phone
                });
            } else {
                form.resetFields();
            }
        }
    }, [isOpen, initialData, form]);

    const handleSubmit = async (values: IRealEstatePayload) => {
        setLoading(true);
        try {
            const payloadToSend = {
                ...values,
                commission: toApiPercentage(values.commission)
            };

            if (initialData) {
                await RealEstateService.update(initialData.key, payloadToSend);
                message.success('Imobiliária atualizada com sucesso!');
            } else {
                await RealEstateService.create(payloadToSend);
                message.success('Imobiliária cadastrada com sucesso!');
            }

            form.resetFields();
            if (onSuccess) onSuccess();
            onClose();
        } catch (error: unknown) {
            await notifyApiError(
                error,
                `Erro ao ${
                    initialData ? 'atualizar' : 'cadastrar'
                } imobiliária.`
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <StyledModal
            title={initialData ? 'Editar Imobiliária' : 'Nova Imobiliária'}
            open={isOpen}
            onCancel={onClose}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okText="Salvar"
            cancelText="Cancelar"
            destroyOnHidden
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    label="Nome da Imobiliária"
                    name="name"
                    rules={[
                        { required: true, message: 'O nome é obrigatório' }
                    ]}
                >
                    <Input placeholder="Ex: Imobiliária Central" />
                </Form.Item>

                <Form.Item
                    label="CNPJ"
                    name="cnpj"
                    rules={[
                        { required: true, message: 'O CNPJ é obrigatório' }
                    ]}
                >
                    <DocumentNumberInput
                        documentType="cnpj"
                        placeholder="00.000.000/0000-00"
                    />
                </Form.Item>

                <Form.Item
                    label="Taxa de Administração (%)"
                    name="commission"
                    rules={[
                        { required: true, message: 'A taxa é obrigatória' }
                    ]}
                >
                    <InputNumber<number>
                        min={0}
                        max={100}
                        precision={2}
                        style={{ width: '100%' }}
                        placeholder="Ex: 10"
                        decimalSeparator=","
                        formatter={formatPercentageInput}
                        parser={parsePercentageInput}
                    />
                </Form.Item>

                <Form.Item
                    label="Endereço"
                    name="address"
                    rules={[
                        { required: true, message: 'O endereço é obrigatório' }
                    ]}
                >
                    <Input placeholder="Endereço completo" />
                </Form.Item>

                <Form.Item
                    label="Telefone"
                    name="phone"
                    rules={[
                        { required: true, message: 'O telefone é obrigatório' }
                    ]}
                >
                    <Input placeholder="(00) 00000-0000" />
                </Form.Item>
            </Form>
        </StyledModal>
    );
};
