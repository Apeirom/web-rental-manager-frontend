/* eslint-disable jsx-a11y/label-has-associated-control */
// src/components/Modals/ExtractBatchModal/components/ExtractItemFields.tsx
import React, { useState } from 'react';
import {
    Form,
    Input,
    InputNumber,
    Button,
    Modal,
    Select,
    Radio,
    Space
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { parseCurrencyInput } from 'utils/formatters';
import { formatBRL } from 'utils/financial';
import { ContractDropdown } from '../../Dropdowns/ContractDropdown';
import { IDynamicItem } from './types';
import {
    FormRow,
    FlexItem,
    SectionTitle,
    DynamicItemList,
    DynamicItemRow
} from './styles';

interface ExtractItemFieldsProps {
    fieldKey: number;
}

const CurrencyInput = ({
    label,
    name,
    fieldKey
}: {
    label: string;
    name: string;
    fieldKey: number;
}) => (
    <FlexItem label={label} name={[fieldKey, name]} initialValue={0}>
        <InputNumber
            min={0}
            precision={2}
            decimalSeparator=","
            parser={parseCurrencyInput}
            style={{ width: '100%' }}
        />
    </FlexItem>
);

export const ExtractItemFields: React.FC<ExtractItemFieldsProps> = ({
    fieldKey
}) => {
    const form = Form.useFormInstance();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalType, setModalType] = useState<'credit' | 'debit'>('credit');
    const [tempItem, setTempItem] = useState<Partial<IDynamicItem>>({
        category: 'others',
        is_withheld_at_source: false
    });

    const openModal = (type: 'credit' | 'debit') => {
        setModalType(type);
        setTempItem({
            category: 'others',
            description: '',
            amount: 0,
            is_withheld_at_source: type === 'debit'
        });
        setIsModalVisible(true);
    };

    const handleAddItem = () => {
        if (!tempItem.description || !tempItem.amount) return;

        const listName =
            modalType === 'credit' ? 'dynamic_credits' : 'dynamic_debits';
        const currentList =
            form.getFieldValue(['extracts', fieldKey, listName]) || [];

        // Atualização direta e limpa no array do Ant Design
        form.setFieldValue(
            ['extracts', fieldKey, listName],
            [...currentList, { ...tempItem, is_credit: modalType === 'credit' }]
        );

        setIsModalVisible(false);
    };

    return (
        <>
            <Form.Item name={[fieldKey, 'key']} hidden>
                <Input />
            </Form.Item>

            <Form.Item
                name={[fieldKey, 'contract_key']}
                rules={[{ required: true, message: 'Selecione o contrato' }]}
            >
                <ContractDropdown label="Contrato Vinculado" />
            </Form.Item>

            <FormRow>
                <FlexItem
                    label="Mês Ref."
                    name={[fieldKey, 'month_ref']}
                    rules={[{ required: true }]}
                >
                    <InputNumber
                        min={1}
                        max={12}
                        placeholder="Ex: 5"
                        style={{ width: '100%' }}
                    />
                </FlexItem>
                <FlexItem
                    label="Ano Ref."
                    name={[fieldKey, 'year_ref']}
                    initialValue={2026}
                    rules={[{ required: true }]}
                >
                    <InputNumber
                        min={1950}
                        placeholder="Ex: 2026"
                        style={{ width: '100%' }}
                    />
                </FlexItem>
            </FormRow>

            <SectionTitle>Composição de Receitas</SectionTitle>
            <FormRow>
                <CurrencyInput
                    fieldKey={fieldKey}
                    label="Aluguel (R$)"
                    name="rent_amount"
                />
                <CurrencyInput
                    fieldKey={fieldKey}
                    label="Multa (R$)"
                    name="penalty"
                />
                <CurrencyInput
                    fieldKey={fieldKey}
                    label="Juros (R$)"
                    name="interest"
                />
            </FormRow>

            <Form.List name={[fieldKey, 'dynamic_credits']}>
                {(fields, { remove }) => (
                    <DynamicItemList>
                        {fields.map((field) => {
                            const item = form.getFieldValue([
                                'extracts',
                                fieldKey,
                                'dynamic_credits',
                                field.name
                            ]);
                            return (
                                <DynamicItemRow key={field.key}>
                                    <span>{item?.description}</span>
                                    <span>{formatBRL(item?.amount)}</span>
                                    <DeleteOutlined
                                        onClick={() => remove(field.name)}
                                        className="delete-icon"
                                    />
                                </DynamicItemRow>
                            );
                        })}
                    </DynamicItemList>
                )}
            </Form.List>
            <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => openModal('credit')}
                block
            >
                Adicionar Receita
            </Button>

            <SectionTitle>Custos e Repasses</SectionTitle>
            <FormRow>
                <CurrencyInput
                    fieldKey={fieldKey}
                    label="IPTU (R$)"
                    name="iptu"
                />
                <CurrencyInput
                    fieldKey={fieldKey}
                    label="Água (R$)"
                    name="water"
                />
            </FormRow>
            <FormRow>
                <CurrencyInput
                    fieldKey={fieldKey}
                    label="Taxa de Adm (R$)"
                    name="administration_fee"
                />
                <CurrencyInput
                    fieldKey={fieldKey}
                    label="Taxa Bancária (R$)"
                    name="bank_fee"
                />
            </FormRow>

            <Form.List name={[fieldKey, 'dynamic_debits']}>
                {(fields, { remove }) => (
                    <DynamicItemList>
                        {fields.map((field) => {
                            const item = form.getFieldValue([
                                'extracts',
                                fieldKey,
                                'dynamic_debits',
                                field.name
                            ]);
                            return (
                                <DynamicItemRow key={field.key}>
                                    <span>
                                        {item?.description}{' '}
                                        <small>
                                            (
                                            {item?.is_withheld_at_source
                                                ? 'Retido'
                                                : 'Repassado'}
                                            )
                                        </small>
                                    </span>
                                    <span>{formatBRL(item?.amount)}</span>
                                    <DeleteOutlined
                                        onClick={() => remove(field.name)}
                                        className="delete-icon"
                                    />
                                </DynamicItemRow>
                            );
                        })}
                    </DynamicItemList>
                )}
            </Form.List>
            <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => openModal('debit')}
                block
            >
                Adicionar Despesa
            </Button>

            <Modal
                title={
                    modalType === 'credit'
                        ? 'Adicionar Receita'
                        : 'Adicionar Despesa'
                }
                open={isModalVisible}
                onOk={handleAddItem}
                onCancel={() => setIsModalVisible(false)}
                destroyOnClose
                okText="Adicionar"
                cancelText="Cancelar"
            >
                <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                        <label>Categoria</label>
                        <Select
                            style={{ width: '100%', marginTop: 4 }}
                            value={tempItem.category}
                            onChange={(v) =>
                                setTempItem({ ...tempItem, category: v })
                            }
                            options={[
                                {
                                    value: 'agreement',
                                    label: 'Taxa de Contrato / Intermediação'
                                },
                                { value: 'maintenance', label: 'Manutenção' },
                                {
                                    value: 'other_revenues',
                                    label: 'Outras Receitas'
                                },
                                { value: 'others', label: 'Outros' }
                            ]}
                        />
                    </div>
                    <div>
                        <label>Descrição</label>
                        <Input
                            style={{ marginTop: 4 }}
                            placeholder="Ex: Conserto da torneira"
                            value={tempItem.description}
                            onChange={(e) =>
                                setTempItem({
                                    ...tempItem,
                                    description: e.target.value
                                })
                            }
                        />
                    </div>
                    <div>
                        <label>Valor (R$)</label>
                        <InputNumber
                            style={{ width: '100%', marginTop: 4 }}
                            min={0}
                            precision={2}
                            decimalSeparator=","
                            value={tempItem.amount}
                            onChange={(v) =>
                                setTempItem({ ...tempItem, amount: v || 0 })
                            }
                        />
                    </div>
                    <div>
                        <label>Comportamento do Valor</label>
                        <Radio.Group
                            style={{ width: '100%', marginTop: 4 }}
                            value={tempItem.is_withheld_at_source}
                            onChange={(e) =>
                                setTempItem({
                                    ...tempItem,
                                    is_withheld_at_source: e.target.value
                                })
                            }
                        >
                            <Radio.Button
                                value
                                style={{ width: '50%', textAlign: 'center' }}
                            >
                                Retido na Fonte
                            </Radio.Button>
                            <Radio.Button
                                value={false}
                                style={{ width: '50%', textAlign: 'center' }}
                            >
                                Repassado
                            </Radio.Button>
                        </Radio.Group>
                    </div>
                </Space>
            </Modal>
        </>
    );
};
