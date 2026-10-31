import React, { useState, useEffect } from 'react';
import { Button, Form, Input, InputNumber, message, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { PropertyService } from 'services/property_service';
import { IPropertyPayload, IProperty } from 'interfaces/property';
import {
    EQUITY_PARTICIPATION_MINIMUM_PERCENTAGE,
    EQUITY_PARTICIPATION_PERCENTAGE_BASE
} from 'constants/property_constants';
import { OwnersDropdown } from 'components/Dropdowns/OwnersDropdown';
import { notifyApiError } from 'utils/error_handler';
import { StyledModal } from '../sharedStyles';

interface PropertyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    initialData?: IProperty | null;
}

export const PropertyModal: React.FC<PropertyModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    initialData
}) => {
    const [form] = Form.useForm<IPropertyPayload>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                form.setFieldsValue({
                    property_name: initialData.property_name,
                    equity_participations:
                        initialData.equity_participations.map((share) => ({
                            owner_key: share.owner.key,
                            participation_percentage:
                                share.participation_percentage
                        })),
                    address: initialData.address,
                    room_count: initialData.room_count
                });
            } else {
                form.resetFields();
                form.setFieldsValue({
                    equity_participations: [
                        {
                            owner_key: '',
                            participation_percentage:
                                EQUITY_PARTICIPATION_PERCENTAGE_BASE
                        }
                    ]
                });
            }
        }
    }, [isOpen, initialData, form]);

    const handleSubmit = async (values: IPropertyPayload) => {
        const participations = values.equity_participations || [];
        const totalPercentage = participations.reduce(
            (total, share) => total + (share.participation_percentage || 0),
            0
        );
        const ownerKeys = participations.map((share) => share.owner_key);
        if (
            (!initialData && !participations.length) ||
            participations.some((share) => !share.owner_key)
        ) {
            message.error(
                initialData
                    ? 'Selecione um proprietário para cada participação.'
                    : 'Adicione ao menos um proprietário ao imóvel.'
            );
            return;
        }
        if (new Set(ownerKeys).size !== ownerKeys.length) {
            message.error('Cada proprietário deve aparecer uma única vez.');
            return;
        }
        if (totalPercentage > EQUITY_PARTICIPATION_PERCENTAGE_BASE) {
            message.error('A soma das participações não pode exceder 100%.');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...values,
                equity_participations: participations
            };
            if (initialData) {
                await PropertyService.update(initialData.key, payload);
                message.success('Imóvel atualizado com sucesso!');
            } else {
                await PropertyService.create(payload);
                message.success('Imóvel cadastrado com sucesso!');
            }
            form.resetFields();
            if (onSuccess) onSuccess();
            onClose();
        } catch (error: unknown) {
            const fallbackMessage = `Erro ao ${
                initialData ? 'atualizar' : 'cadastrar'
            } imóvel.`;
            await notifyApiError(error, fallbackMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <StyledModal
            title={initialData ? 'Editar Imóvel' : 'Novo Imóvel'}
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
                    label="Nome/Identificação"
                    name="property_name"
                    rules={[
                        {
                            required: true,
                            message: 'A identificação é obrigatória'
                        }
                    ]}
                >
                    <Input placeholder="Ex: Apt 101 - Edifício Sol" />
                </Form.Item>

                <Form.List
                    name="equity_participations"
                    rules={[
                        {
                            validator: async (_, values) => {
                                if (!initialData && !values?.length) {
                                    throw new Error(
                                        'Adicione ao menos um proprietário.'
                                    );
                                }
                                const total = values.reduce(
                                    (
                                        sum: number,
                                        row: {
                                            participation_percentage?: number;
                                        }
                                    ) =>
                                        sum +
                                        (row.participation_percentage || 0),
                                    0
                                );
                                if (
                                    total > EQUITY_PARTICIPATION_PERCENTAGE_BASE
                                ) {
                                    throw new Error(
                                        'A soma das participações não pode exceder 100%.'
                                    );
                                }
                            }
                        }
                    ]}
                >
                    {(fields, { add, remove }, { errors }) => (
                        <div>
                            <Form.Item label="Proprietários e participações">
                                {fields.map((field) => (
                                    <Space
                                        key={field.key}
                                        align="baseline"
                                        style={{
                                            display: 'flex',
                                            marginBottom: 8
                                        }}
                                    >
                                        <Form.Item
                                            name={[field.name, 'owner_key']}
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        'Selecione um proprietário'
                                                }
                                            ]}
                                            style={{ width: 270 }}
                                        >
                                            <OwnersDropdown
                                                label=""
                                                placeholder="Selecione um proprietário"
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name={[
                                                field.name,
                                                'participation_percentage'
                                            ]}
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        'Informe a participação'
                                                },
                                                {
                                                    type: 'number',
                                                    min: EQUITY_PARTICIPATION_MINIMUM_PERCENTAGE,
                                                    max: EQUITY_PARTICIPATION_PERCENTAGE_BASE,
                                                    message:
                                                        'Informe um valor entre 0,01% e 100%'
                                                }
                                            ]}
                                        >
                                            <InputNumber
                                                min={
                                                    EQUITY_PARTICIPATION_MINIMUM_PERCENTAGE
                                                }
                                                max={
                                                    EQUITY_PARTICIPATION_PERCENTAGE_BASE
                                                }
                                                precision={2}
                                                decimalSeparator=","
                                                addonAfter="%"
                                                style={{ width: 130 }}
                                            />
                                        </Form.Item>
                                        {(fields.length > 1 || initialData) && (
                                            <MinusCircleOutlined
                                                onClick={() =>
                                                    remove(field.name)
                                                }
                                            />
                                        )}
                                    </Space>
                                ))}
                                <Form.ErrorList errors={errors} />
                                <Button
                                    type="dashed"
                                    onClick={() =>
                                        add({
                                            owner_key: '',
                                            participation_percentage:
                                                EQUITY_PARTICIPATION_MINIMUM_PERCENTAGE
                                        })
                                    }
                                    icon={<PlusOutlined />}
                                    block
                                >
                                    Adicionar proprietário
                                </Button>
                            </Form.Item>
                        </div>
                    )}
                </Form.List>

                <Form.Item
                    label="Endereço Completo"
                    name="address"
                    rules={[
                        { required: true, message: 'O endereço é obrigatório' }
                    ]}
                >
                    <Input placeholder="Rua, Número, Bairro, Cidade" />
                </Form.Item>

                <Form.Item
                    label="Número de Quartos"
                    name="room_count"
                    rules={[
                        {
                            required: true,
                            message: 'O número de quartos é obrigatório'
                        }
                    ]}
                >
                    <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        placeholder="Ex: 2"
                    />
                </Form.Item>
            </Form>
        </StyledModal>
    );
};
