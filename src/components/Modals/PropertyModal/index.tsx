import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, message } from 'antd';
import { PropertyService } from 'services/property_service';
import { IPropertyPayload, IProperty } from 'interfaces/property';
import { StyledModal } from '../sharedStyles';

interface PropertyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    initialData?: IProperty | null;
}

export const PropertyModal: React.FC<PropertyModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    initialData
}) => {
    const [form] = Form.useForm<IPropertyPayload>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                form.setFieldsValue({
                    property_name: initialData.property_name,
                    owner_name: initialData.owner_name,
                    address: initialData.address,
                    room_count: initialData.room_count
                });
            } else {
                form.resetFields();
            }
        }
    }, [isOpen, initialData, form]);

    const handleSubmit = async (values: IPropertyPayload) => {
        setLoading(true);
        try {
            if (initialData) {
                await PropertyService.update(initialData.key, values);
                message.success('Imóvel atualizado com sucesso!');
            } else {
                await PropertyService.create(values);
                message.success('Imóvel cadastrado com sucesso!');
            }
            form.resetFields();
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            message.error(
                `Erro ao ${initialData ? 'atualizar' : 'cadastrar'} imóvel.`
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <StyledModal
            title={initialData ? 'Editar Imóvel' : 'Novo Imóvel'}
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
                    rules={[
                        {
                            required: true,
                            message: 'A identificação é obrigatória'
                        }
                    ]}
                >
                    <Input placeholder="Ex: Apt 101 - Edifício Sol" />
                </Form.Item>

                <Form.Item
                    label="Nome do Proprietário"
                    name="owner_name"
                    rules={[
                        {
                            required: true,
                            message: 'O nome do proprietário é obrigatório'
                        }
                    ]}
                >
                    <Input placeholder="Ex: Maria Oliveira" />
                </Form.Item>

                <Form.Item
                    label="Endereço Completo"
                    name="address"
                    rules={[
                        { required: true, message: 'O endereço é obrigatório' }
                    ]}
                >
                    <Input placeholder="Rua, Número, Bairro, Cidade" />
                </Form.Item>

                <Form.Item
                    label="Número de Quartos"
                    name="room_count"
                    rules={[
                        {
                            required: true,
                            message: 'O número de quartos é obrigatório'
                        }
                    ]}
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
