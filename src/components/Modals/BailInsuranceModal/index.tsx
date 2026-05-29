import React, { useState } from 'react';
import { Form, Input, InputNumber, message } from 'antd';
import { BailInsuranceService } from 'services/bail_insurance_service';
import { IBailInsurancePayload } from 'interfaces/bail_insurance';
import { StyledModal } from '../sharedStyles';

interface BailInsuranceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const BailInsuranceModal: React.FC<BailInsuranceModalProps> = ({
    isOpen,
    onClose,
    onSuccess
}) => {
    const [form] = Form.useForm<IBailInsurancePayload>();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: IBailInsurancePayload) => {
        setLoading(true);
        try {
            await BailInsuranceService.create(values);
            message.success('Seguro fiança cadastrado com sucesso!');
            form.resetFields();
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            message.error('Erro ao cadastrar seguro fiança.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <StyledModal
            title="Novo Seguro Fiança"
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
                    label="Seguradora"
                    name="insurance_company"
                    rules={[{ required: true }]}
                >
                    <Input placeholder="Ex: Porto Seguro" />
                </Form.Item>

                <Form.Item
                    label="Valor (R$)"
                    name="value"
                    rules={[{ required: true }]}
                >
                    <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        placeholder="Ex: 1500.00"
                        precision={2}
                    />
                </Form.Item>

                <Form.Item
                    label="Validade"
                    name="validity"
                    rules={[{ required: true }]}
                >
                    <Input placeholder="Ex: 12/2027 ou 31/12/2027" />
                </Form.Item>
            </Form>
        </StyledModal>
    );
};
