import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, message } from 'antd';
import { PaymentService } from 'services/payment_service';
import { parseCurrencyInput } from 'utils/formatters';
import {
    IPayment,
    IPaymentCreatePayload,
    IPaymentUpdatePayload
} from 'interfaces/payment';
import { StyledModal } from '../sharedStyles';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    initialData?: IPayment | null;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    initialData
}) => {
    const [form] = Form.useForm<any>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                form.setFieldsValue({
                    payment_date: initialData.payment_date,
                    amount: initialData.amount,
                    status_enumerator: initialData.status
                });
            } else {
                form.resetFields();
            }
        }
    }, [isOpen, initialData, form]);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            if (initialData) {
                const updatePayload: IPaymentUpdatePayload = {
                    payment_date: values.payment_date,
                    amount: values.amount
                };
                await PaymentService.update(initialData.key, updatePayload);
                message.success('Pagamento atualizado com sucesso!');
            } else {
                const createPayload: IPaymentCreatePayload = {
                    payment_date: values.payment_date,
                    amount: values.amount
                };
                await PaymentService.create(createPayload);
                message.success(
                    'Pagamento registrado e aguardando conciliação!'
                );
            }
            form.resetFields();
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            message.error('Erro ao salvar pagamento.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <StyledModal
            title={
                initialData
                    ? 'Editar Recebimento'
                    : 'Registrar Recebimento (Cego)'
            }
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
                    label="Data do Recebimento"
                    name="payment_date"
                    rules={[
                        { required: true, message: 'A data é obrigatória' }
                    ]}
                >
                    <Input type="date" style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="Valor Recebido (R$)"
                    name="amount"
                    rules={[
                        { required: true, message: 'O valor é obrigatório' }
                    ]}
                >
                    <InputNumber
                        min={0.01}
                        precision={2}
                        decimalSeparator=","
                        style={{ width: '100%' }}
                        placeholder="Ex: 1500,00"
                        parser={parseCurrencyInput}
                    />
                </Form.Item>
            </Form>
        </StyledModal>
    );
};
