import React, { useEffect, useState } from 'react';
import {
    Form,
    Input,
    InputNumber,
    Select,
    Switch,
    DatePicker,
    message,
    Divider
} from 'antd';
import dayjs from 'dayjs';
import {
    IGuarantee,
    IGuaranteePayload,
    GuaranteeTypeEnum
} from 'interfaces/guarantee';
import { GuaranteeService } from 'services/guarantee_service';
import { parseCurrencyInput } from 'utils/formatters';

import { StyledModal, DynamicFormArea, SectionTitle } from './styles';

interface GuaranteeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (guarantee?: IGuarantee) => void;
    initialData?: IGuarantee | null;
}

export const GuaranteeModal: React.FC<GuaranteeModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    initialData
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const selectedType = Form.useWatch('type', form) as GuaranteeTypeEnum;

    useEffect(() => {
        if (isOpen && initialData) {
            if (initialData.type === 'deposit') {
                form.setFieldsValue({
                    ...initialData,
                    deposit_date: initialData.deposit_date
                        ? dayjs(initialData.deposit_date)
                        : undefined
                });
            } else if (initialData.type === 'bail_insurance') {
                form.setFieldsValue({
                    ...initialData,
                    validity: initialData.validity
                        ? dayjs(initialData.validity)
                        : undefined
                });
            } else {
                form.setFieldsValue(initialData);
            }
        } else if (isOpen) {
            form.resetFields();
            form.setFieldsValue({ type: 'deposit' });
        }
    }, [isOpen, initialData, form]);

    const handleClose = () => {
        form.resetFields();
        onClose();
    };

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            // Preparação do Payload formatando datas para strings (YYYY-MM-DD)
            const payload: any = { ...values };

            if (payload.type === 'deposit' && payload.deposit_date) {
                payload.deposit_date =
                    payload.deposit_date.format('YYYY-MM-DD');
            }
            if (payload.type === 'bail_insurance' && payload.validity) {
                payload.validity = payload.validity.format('YYYY-MM-DD');
            }
            let savedGuarantee: IGuarantee;

            if (initialData) {
                savedGuarantee = await GuaranteeService.update(
                    initialData.key,
                    payload as IGuaranteePayload
                );
                message.success('Garantia atualizada com sucesso!');
            } else {
                savedGuarantee = await GuaranteeService.create(
                    payload as IGuaranteePayload
                );
                message.success('Garantia cadastrada com sucesso!');
            }

            if (onSuccess) onSuccess(savedGuarantee);
            handleClose();
        } catch (error) {
            message.error('Erro ao salvar a garantia.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <StyledModal
            title={initialData ? 'Editar Garantia' : 'Nova Garantia'}
            open={isOpen}
            onCancel={handleClose}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okText="Salvar"
            cancelText="Cancelar"
            destroyOnHidden
            width={600}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    label="Selecione o Tipo de Garantia"
                    name="type"
                    rules={[{ required: true, message: 'Obrigatório' }]}
                >
                    <Select
                        disabled={!!initialData}
                        options={[
                            { value: 'deposit', label: 'Caução (Depósito)' },
                            { value: 'guarantor', label: 'Fiador' },
                            { value: 'bail_insurance', label: 'Seguro Fiança' }
                        ]}
                    />
                </Form.Item>

                <Divider />

                <DynamicFormArea>
                    {selectedType === 'deposit' && (
                        <>
                            <SectionTitle>Parâmetros da Caução</SectionTitle>
                            <Form.Item
                                label="Valor (R$)"
                                name="amount"
                                rules={[
                                    { required: true, message: 'Obrigatório' }
                                ]}
                            >
                                <InputNumber
                                    min={0}
                                    precision={2}
                                    style={{ width: '100%' }}
                                    decimalSeparator=","
                                    parser={parseCurrencyInput}
                                />
                            </Form.Item>

                            <div style={{ display: 'flex', gap: '16px' }}>
                                <Form.Item
                                    label="Data do Depósito"
                                    name="deposit_date"
                                    style={{ flex: 1 }}
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Pago em Dinheiro Vivo?"
                                    name="paid_in_cash"
                                    valuePropName="checked"
                                >
                                    <Switch
                                        checkedChildren="Sim"
                                        unCheckedChildren="Não"
                                    />
                                </Form.Item>
                            </div>
                        </>
                    )}

                    {selectedType === 'guarantor' && (
                        <>
                            <SectionTitle>Dados do Fiador</SectionTitle>
                            <Form.Item
                                label="Nome Completo"
                                name="name"
                                rules={[
                                    { required: true, message: 'Obrigatório' }
                                ]}
                            >
                                <Input placeholder="Nome do fiador" />
                            </Form.Item>

                            <Form.Item
                                label="CPF / CNPJ"
                                name="document_number"
                                rules={[
                                    { required: true, message: 'Obrigatório' }
                                ]}
                            >
                                <Input placeholder="000.000.000-00" />
                            </Form.Item>
                        </>
                    )}

                    {selectedType === 'bail_insurance' && (
                        <>
                            <SectionTitle>
                                Apólice do Seguro Fiança
                            </SectionTitle>
                            <Form.Item
                                label="Seguradora"
                                name="insurance_company"
                                rules={[
                                    { required: true, message: 'Obrigatório' }
                                ]}
                            >
                                <Input placeholder="Ex: Porto Seguro, CredPago..." />
                            </Form.Item>

                            <div style={{ display: 'flex', gap: '16px' }}>
                                <Form.Item
                                    label="Valor Coberto (R$)"
                                    name="value"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Obrigatório'
                                        }
                                    ]}
                                    style={{ flex: 1 }}
                                >
                                    <InputNumber
                                        min={0}
                                        precision={2}
                                        style={{ width: '100%' }}
                                        decimalSeparator=","
                                        parser={parseCurrencyInput}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Validade"
                                    name="validity"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Obrigatório'
                                        }
                                    ]}
                                    style={{ flex: 1 }}
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                            </div>
                        </>
                    )}
                </DynamicFormArea>
            </Form>
        </StyledModal>
    );
};
