import React, { useState } from 'react';
import { Form, Input, InputNumber, message } from 'antd';
import { RealEstateService } from 'services/real_estate_service';
import { IRealEstatePayload } from 'interfaces/real_estate';
import { StyledModal } from '../sharedStyles';

interface RealEstateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const RealEstateModal: React.FC<RealEstateModalProps> = ({
    isOpen,
    onClose,
    onSuccess
}) => {
    const [form] = Form.useForm<IRealEstatePayload>();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: IRealEstatePayload) => {
        setLoading(true);
        try {
            await RealEstateService.create(values);
            message.success('Imobiliária cadastrada com sucesso!');
            form.resetFields();
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            message.error('Erro ao cadastrar imobiliária.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <StyledModal
            title="Nova Imobiliária"
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
                    rules={[{ required: true }]}
                >
                    <Input placeholder="Ex: Imobiliária Central" />
                </Form.Item>

                <Form.Item
                    label="CNPJ"
                    name="cnpj"
                    rules={[
                        { required: true },
                        {
                            pattern: /^(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})$/,
                            message: 'Formato: 00.000.000/0000-00'
                        }
                    ]}
                >
                    <Input placeholder="00.000.000/0000-00" />
                </Form.Item>

                <Form.Item
                    label="Taxa de Administração (%)"
                    name="commission"
                    rules={[{ required: true }]}
                >
                    <InputNumber
                        min={0}
                        max={100}
                        step={0.1}
                        style={{ width: '100%' }}
                        placeholder="Ex: 10"
                    />
                </Form.Item>

                <Form.Item
                    label="Endereço"
                    name="address"
                    rules={[{ required: true }]}
                >
                    <Input placeholder="Endereço completo" />
                </Form.Item>

                <Form.Item
                    label="Telefone"
                    name="phone"
                    rules={[{ required: true }]}
                >
                    <Input placeholder="(00) 00000-0000" />
                </Form.Item>
            </Form>
        </StyledModal>
    );
};
