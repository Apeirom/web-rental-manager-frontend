import React, { useState, useEffect } from 'react';
import { Form, Input, message } from 'antd';
import { TenantService } from 'services/tenant_service';
import { ITenantPayload, ITenant } from 'interfaces/tenant';
import { StyledModal } from '../sharedStyles';

interface TenantModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    initialData?: ITenant | null;
}

export const TenantModal: React.FC<TenantModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    initialData
}) => {
    const [form] = Form.useForm<ITenantPayload>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                form.setFieldsValue({
                    name: initialData.name,
                    document_number: initialData.document_number
                });
            } else {
                form.resetFields();
            }
        }
    }, [isOpen, initialData, form]);

    const handleSubmit = async (values: ITenantPayload) => {
        setLoading(true);
        try {
            if (initialData) {
                await TenantService.update(initialData.key, values);
                message.success('Inquilino atualizado com sucesso!');
            } else {
                await TenantService.create(values);
                message.success('Inquilino cadastrado com sucesso!');
            }
            form.resetFields();
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            message.error(
                `Erro ao ${
                    initialData ? 'atualizar' : 'cadastrar'
                } inquilino. Verifique os dados.`
            );
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <StyledModal
            title={initialData ? 'Editar Inquilino' : 'Novo Inquilino'}
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
