import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, message } from 'antd';
import { PaymentService } from 'services/payment_service';
import { parseCurrencyInput } from 'utils/formatters';
import {
    IPayment,
    IPaymentCreatePayload,
    IPaymentUpdatePayload
} from 'interfaces/payment';
import { notifyApiError, extractApiErrorCode } from 'utils/error_handler';
import { DUPLICATE_PAYMENT_ERROR_CODE } from 'constants/payment_constants';
import { DuplicatePaymentModal } from '../DuplicatePaymentModal';
import { StyledModal } from '../sharedStyles';

interface PaymentFormValues {
    payment_date: string;
    amount: number;
    status_enumerator?: string;
}

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
    const [form] = Form.useForm<PaymentFormValues>();
    const [loading, setLoading] = useState(false);
    const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
    const [pendingPayment, setPendingPayment] =
        useState<IPaymentCreatePayload | null>(null);
    const [confirmingDuplicate, setConfirmingDuplicate] = useState(false);

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
        } else {
            setDuplicateModalOpen(false);
            setPendingPayment(null);
        }
    }, [isOpen, initialData, form]);

    const handleSubmit = async (values: PaymentFormValues) => {
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
        } catch (error: unknown) {
            const errorCode = extractApiErrorCode(error);
            if (errorCode === DUPLICATE_PAYMENT_ERROR_CODE && !initialData) {
                setPendingPayment({
                    payment_date: values.payment_date,
                    amount: values.amount
                });
                setDuplicateModalOpen(true);
            } else {
                await notifyApiError(error, 'Erro ao salvar pagamento.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmDuplicate = async () => {
        if (!pendingPayment) return;
        setConfirmingDuplicate(true);
        try {
            await PaymentService.create({
                ...pendingPayment,
                confirm_duplicate: true
            });
            message.success('Pagamento registrado com sucesso!');
            setDuplicateModalOpen(false);
            setPendingPayment(null);
            form.resetFields();
            if (onSuccess) onSuccess();
            onClose();
        } catch (error: unknown) {
            await notifyApiError(
                error,
                'Erro ao registrar pagamento duplicado.'
            );
        } finally {
            setConfirmingDuplicate(false);
        }
    };

    const handleCloseDuplicateModal = () => {
        setDuplicateModalOpen(false);
        setPendingPayment(null);
    };

    return (
        <>
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

            {pendingPayment && (
                <DuplicatePaymentModal
                    isOpen={duplicateModalOpen}
                    onClose={handleCloseDuplicateModal}
                    onConfirm={handleConfirmDuplicate}
                    paymentDate={pendingPayment.payment_date}
                    amount={pendingPayment.amount}
                    loading={confirmingDuplicate}
                />
            )}
        </>
    );
};
