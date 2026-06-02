import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, message } from 'antd';
import { BailInsuranceService } from 'services/bail_insurance_service';
import {
    IBailInsurancePayload,
    IBailInsurance
} from 'interfaces/bail_insurance';
import { parseCurrencyInput } from 'utils/formatters';
import { StyledModal } from '../sharedStyles';

interface BailInsuranceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    initialData?: IBailInsurance | null;
}

export const BailInsuranceModal: React.FC<BailInsuranceModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    initialData
}) => {
    const [form] = Form.useForm<IBailInsurancePayload>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                form.setFieldsValue({
                    insurance_company: initialData.insurance_company,
                    value: initialData.value,
                    validity: initialData.validity
                });
            } else {
                form.resetFields();
            }
        }
    }, [isOpen, initialData, form]);

    const handleSubmit = async (values: IBailInsurancePayload) => {
        setLoading(true);
        try {
            if (initialData) {
                await BailInsuranceService.update(initialData.key, values);
                message.success('Seguro fiança atualizado com sucesso!');
            } else {
                await BailInsuranceService.create(values);
                message.success('Seguro fiança cadastrado com sucesso!');
            }

            form.resetFields();
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            message.error(
                `Erro ao ${
                    initialData ? 'atualizar' : 'cadastrar'
                } seguro fiança.`
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <StyledModal
            title={initialData ? 'Editar Seguro Fiança' : 'Novo Seguro Fiança'}
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
                    rules={[
                        {
                            required: true,
                            message: 'Insira o nome da seguradora'
                        }
                    ]}
                >
                    <Input placeholder="Ex: Porto Seguro" />
                </Form.Item>

                <Form.Item
                    label="Valor (R$)"
                    name="value"
                    rules={[{ required: true, message: 'Insira o valor' }]}
                >
                    <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        placeholder="Ex: 1500.00"
                        precision={2}
                        decimalSeparator=","
                        parser={parseCurrencyInput}
                    />
                </Form.Item>

                <Form.Item
                    label="Validade"
                    name="validity"
                    rules={[{ required: true, message: 'Insira a validade' }]}
                >
                    <Input placeholder="Ex: 12/2027 ou 31/12/2027" />
                </Form.Item>
            </Form>
        </StyledModal>
    );
};
