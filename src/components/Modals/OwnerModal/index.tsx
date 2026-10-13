import React, { useState, useEffect } from 'react';
import { Form, Input, message } from 'antd';
import { IOwner, IOwnerPayload } from 'interfaces/owner';
import { OwnerService } from 'services/owner_service';
import { StyledModal } from '../sharedStyles';

interface OwnerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    initialData?: IOwner | null;
}

export const OwnerModal: React.FC<OwnerModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    initialData
}) => {
    const [form] = Form.useForm<IOwnerPayload>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                form.setFieldsValue({
                    name: initialData.name,
                    document_number: initialData.document_number || undefined
                });
            } else {
                form.resetFields();
            }
        }
    }, [isOpen, initialData, form]);

    const handleSubmit = async (values: IOwnerPayload) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                document_number: values.document_number?.trim() || null
            };

            if (initialData) {
                await OwnerService.update(initialData.key, payload);
                message.success('Proprietário atualizado com sucesso!');
            } else {
                await OwnerService.create(payload);
                message.success('Proprietário cadastrado com sucesso!');
            }
            form.resetFields();
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            message.error(
                `Erro ao ${
                    initialData ? 'atualizar' : 'cadastrar'
                } proprietário.`
            );
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <StyledModal
            title={initialData ? 'Editar Proprietário' : 'Novo Proprietário'}
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
                    <Input placeholder="Ex: Maria Oliveira" />
                </Form.Item>

                <Form.Item label="Documento (CPF/CNPJ)" name="document_number">
                    <Input placeholder="Opcional" />
                </Form.Item>
            </Form>
        </StyledModal>
    );
};
