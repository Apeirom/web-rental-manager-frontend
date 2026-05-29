import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, message } from 'antd';
import { PaymentService } from 'services/payment_service';
import { IPayment, IPaymentPayload } from 'interfaces/payment';
import { ContractDropdown } from '../../Dropdowns/ContractDropdown';
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
    const [form] = Form.useForm<IPaymentPayload>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && initialData) {
            form.setFieldsValue({
                contract_key: initialData.contract.key,
                payment_date: initialData.payment_date,
                month_ref: initialData.month_ref,
                year_ref: initialData.year_ref,
                receipt_path: initialData.receipt_path
            });
        } else if (isOpen) {
            form.resetFields();
        }
    }, [isOpen, initialData, form]);

    const handleSubmit = async (values: IPaymentPayload) => {
        setLoading(true);
        try {
            if (initialData) {
                await PaymentService.update(initialData.key, values);
                message.success('Pagamento atualizado com sucesso!');
            } else {
                await PaymentService.create(values);
                message.success('Pagamento registrado com sucesso!');
            }
            form.resetFields();
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            message.error('Erro ao registrar pagamento.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <StyledModal
            title={initialData ? 'Editar Pagamento' : 'Registrar Pagamento'}
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
                    name="contract_key"
                    rules={[
                        { required: true, message: 'Selecione o contrato' }
                    ]}
                >
                    <ContractDropdown
                        label="Contrato Vinculado"
                        disabled={!!initialData}
                    />
                </Form.Item>

                <div style={{ display: 'flex', gap: '16px' }}>
                    <Form.Item
                        label="Mês Referência"
                        name="month_ref"
                        rules={[{ required: true }]}
                        style={{ flex: 1 }}
                    >
                        <InputNumber
                            min={1}
                            max={12}
                            style={{ width: '100%' }}
                            placeholder="Ex: 5"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Ano Referência"
                        name="year_ref"
                        rules={[{ required: true }]}
                        style={{ flex: 1 }}
                    >
                        <InputNumber
                            min={2020}
                            style={{ width: '100%' }}
                            placeholder="Ex: 2026"
                        />
                    </Form.Item>
                </div>

                <Form.Item
                    label="Data do Pagamento"
                    name="payment_date"
                    rules={[{ required: true }]}
                >
                    <Input type="date" style={{ width: '100%' }} />
                </Form.Item>
            </Form>
        </StyledModal>
    );
};
