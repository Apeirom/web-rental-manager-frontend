import React, { useState } from 'react';
import { Form, Input, InputNumber, message } from 'antd';
import { PropertyService } from 'services/property_service';
import { IPropertyPayload } from 'interfaces/property';
import { StyledModal } from '../sharedStyles';

interface PropertyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const PropertyModal: React.FC<PropertyModalProps> = ({
    isOpen,
    onClose,
    onSuccess
}) => {
    const [form] = Form.useForm<IPropertyPayload>();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: IPropertyPayload) => {
        setLoading(true);
        try {
            await PropertyService.create(values);
            message.success('Imóvel cadastrado com sucesso!');
            form.resetFields();
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            message.error('Erro ao cadastrar imóvel.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <StyledModal
            title="Novo Imóvel"
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
                    label="Nome/Identificação"
                    name="property_name"
                    rules={[{ required: true }]}
                >
                    <Input placeholder="Ex: Apt 101 - Edifício Sol" />
                </Form.Item>

                <Form.Item
                    label="Nome do Proprietário"
                    name="owner_name"
                    rules={[{ required: true }]}
                >
                    <Input placeholder="Ex: Maria Oliveira" />
                </Form.Item>

                <Form.Item
                    label="Endereço Completo"
                    name="address"
                    rules={[{ required: true }]}
                >
                    <Input placeholder="Rua, Número, Bairro, Cidade" />
                </Form.Item>

                <Form.Item
                    label="Número de Quartos"
                    name="room_count"
                    rules={[{ required: true }]}
                >
                    <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        placeholder="Ex: 2"
                    />
                </Form.Item>
            </Form>
        </StyledModal>
    );
};
