import React, { useState } from 'react';
import { Form, Input, message } from 'antd';
import { TenantService } from 'services/tenant_service';
import { ITenantPayload } from 'interfaces/tenant';
import { StyledModal } from '../sharedStyles';

interface TenantModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const TenantModal: React.FC<TenantModalProps> = ({
    isOpen,
    onClose,
    onSuccess
}) => {
    const [form] = Form.useForm<ITenantPayload>();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: ITenantPayload) => {
        setLoading(true);
        try {
            await TenantService.create(values);
            message.success('Inquilino cadastrado com sucesso!');
            form.resetFields();
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            message.error('Erro ao cadastrar inquilino. Verifique os dados.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <StyledModal
            title="Novo Inquilino"
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
                    label="Nome Completo"
                    name="name"
                    rules={[
                        { required: true, message: 'O nome é obrigatório' }
                    ]}
                >
                    <Input placeholder="Ex: João da Silva" />
                </Form.Item>

                <Form.Item
                    label="Documento (CPF/CNPJ)"
                    name="document_number"
                    rules={[
                        {
                            required: true,
                            message: 'O documento é obrigatório'
                        },
                        {
                            pattern:
                                /^(\d{2,3}(\.\d{3}){2}\/\d{4}-\d{2}|\d{3}(\.\d{3}){2}-\d{2})$/,
                            message:
                                'Formato inválido. Use a pontuação correta (ex: 000.000.000-00)'
                        }
                    ]}
                >
                    <Input placeholder="000.000.000-00" />
                </Form.Item>
            </Form>
        </StyledModal>
    );
};
