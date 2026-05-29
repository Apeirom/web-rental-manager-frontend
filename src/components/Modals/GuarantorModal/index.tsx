import React, { useState } from 'react';
import { Form, Input, message } from 'antd';
import { GuarantorService } from 'services/guarantor_service';
import { IGuarantorPayload } from 'interfaces/guarantor';
import { StyledModal } from '../sharedStyles';

interface GuarantorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const GuarantorModal: React.FC<GuarantorModalProps> = ({
    isOpen,
    onClose,
    onSuccess
}) => {
    const [form] = Form.useForm<IGuarantorPayload>();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: IGuarantorPayload) => {
        setLoading(true);
        try {
            await GuarantorService.create(values);
            message.success('Fiador cadastrado com sucesso!');
            form.resetFields();
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            message.error('Erro ao cadastrar fiador.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <StyledModal
            title="Novo Fiador"
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
                    rules={[{ required: true }]}
                >
                    <Input placeholder="Ex: Carlos Pereira" />
                </Form.Item>

                <Form.Item
                    label="Documento (CPF/CNPJ)"
                    name="document_number"
                    rules={[
                        { required: true },
                        {
                            pattern:
                                /^(\d{2,3}(\.\d{3}){2}\/\d{4}-\d{2}|\d{3}(\.\d{3}){2}-\d{2})$/,
                            message: 'Formato inválido.'
                        }
                    ]}
                >
                    <Input placeholder="000.000.000-00" />
                </Form.Item>
            </Form>
        </StyledModal>
    );
};
