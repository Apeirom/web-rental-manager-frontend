// src/components/Modals/ExtractBatchModal/ExtractItemFields.tsx
import React, { useState } from 'react';
import {
    Form,
    Input,
    InputNumber,
    Button,
    Modal,
    Select,
    Radio,
    Space,
    message
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import {
    EXTRACT_DYNAMIC_CATEGORY_OPTIONS,
    ExtractItemCategory
} from 'interfaces/extract';
import { parseCurrencyInput } from 'utils/formatters';
import { formatBRL } from 'utils/financial';
import { ContractDropdown } from '../../Dropdowns/ContractDropdown';
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

interface NewItemState {
    category: ExtractItemCategory;
    description: string;
    amount: number;
    is_credit: boolean;
    is_withheld_at_source: boolean;
}

const createNewItem = (isCredit: boolean): NewItemState => ({
    category: 'others',
    description: '',
    amount: 0,
    is_credit: isCredit,
    is_withheld_at_source: !isCredit
});

export const ExtractItemFields: React.FC<ExtractItemFieldsProps> = ({
    fieldKey
}) => {
    const form = Form.useFormInstance();

    // Estado inteligente do Modal para saber em qual lista ele vai injetar o dado
    const [modalConfig, setModalConfig] = useState<{
        visible: boolean;
        isCredit: boolean;
        addFn: ((val: NewItemState) => void) | null;
    }>({ visible: false, isCredit: true, addFn: null });

    const [newItem, setNewItem] = useState<NewItemState>(createNewItem(true));

    const openModal = (
        isCredit: boolean,
        addFn: (val: NewItemState) => void
    ) => {
        setNewItem(createNewItem(isCredit));
        setModalConfig({ visible: true, isCredit, addFn });
    };

    const handleAddItem = () => {
        if (!newItem.description) {
            message.warning('Preencha a descrição do item');
            return;
        }
        if (newItem.amount <= 0) {
            message.warning('O valor deve ser maior que zero');
            return;
        }

        // Chama a função add do Form.List correto!
        if (modalConfig.addFn) modalConfig.addFn(newItem);
        setModalConfig({ ...modalConfig, visible: false });
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
                <FlexItem label="Mês Ref." name={[fieldKey, 'month_ref']}>
                    <InputNumber min={1} max={12} style={{ width: '100%' }} />
                </FlexItem>
                <FlexItem label="Ano Ref." name={[fieldKey, 'year_ref']}>
                    <InputNumber min={1950} style={{ width: '100%' }} />
                </FlexItem>
            </FormRow>

            <SectionTitle>Composição de Receitas</SectionTitle>
            <FormRow>
                <FlexItem
                    label="Aluguel (R$)"
                    name={[fieldKey, 'fixedItems', 'rent']}
                >
                    <InputNumber
                        min={0}
                        precision={2}
                        decimalSeparator=","
                        parser={parseCurrencyInput}
                        style={{ width: '100%' }}
                    />
                </FlexItem>
                <FlexItem
                    label="Multa (R$)"
                    name={[fieldKey, 'fixedItems', 'penalty']}
                >
                    <InputNumber
                        min={0}
                        precision={2}
                        decimalSeparator=","
                        parser={parseCurrencyInput}
                        style={{ width: '100%' }}
                    />
                </FlexItem>
                <FlexItem
                    label="Juros (R$)"
                    name={[fieldKey, 'fixedItems', 'interest']}
                >
                    <InputNumber
                        min={0}
                        precision={2}
                        decimalSeparator=","
                        parser={parseCurrencyInput}
                        style={{ width: '100%' }}
                    />
                </FlexItem>
            </FormRow>

            {/* Form.List CORRETO para os Créditos Dinâmicos */}
            <Form.List name={[fieldKey, 'dynamicCredits']}>
                {(fields, { add, remove }) => (
                    <>
                        <DynamicItemList>
                            {fields.map((field) => {
                                const item = form.getFieldValue([
                                    'extracts',
                                    fieldKey,
                                    'dynamicCredits',
                                    field.name
                                ]);
                                if (!item) return null;
                                return (
                                    <DynamicItemRow key={field.key}>
                                        <Form.Item
                                            name={[field.name, 'category']}
                                            hidden
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name={[field.name, 'description']}
                                            hidden
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name={[field.name, 'amount']}
                                            hidden
                                        >
                                            <InputNumber />
                                        </Form.Item>
                                        <Form.Item
                                            name={[field.name, 'is_credit']}
                                            hidden
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name={[
                                                field.name,
                                                'is_withheld_at_source'
                                            ]}
                                            hidden
                                        >
                                            <Input />
                                        </Form.Item>

                                        <span>{item.description}</span>
                                        <span>{formatBRL(item.amount)}</span>
                                        <DeleteOutlined
                                            onClick={() => remove(field.name)}
                                            className="delete-icon"
                                        />
                                    </DynamicItemRow>
                                );
                            })}
                        </DynamicItemList>
                        <Button
                            type="dashed"
                            icon={<PlusOutlined />}
                            onClick={() => openModal(true, add)}
                            block
                        >
                            Adicionar Receita
                        </Button>
                    </>
                )}
            </Form.List>

            <SectionTitle>Custos e Repasses</SectionTitle>
            <FormRow>
                <FlexItem
                    label="IPTU (R$)"
                    name={[fieldKey, 'fixedItems', 'iptu']}
                >
                    <InputNumber
                        min={0}
                        precision={2}
                        decimalSeparator=","
                        parser={parseCurrencyInput}
                        style={{ width: '100%' }}
                    />
                </FlexItem>
                <FlexItem
                    label="Água (R$)"
                    name={[fieldKey, 'fixedItems', 'water']}
                >
                    <InputNumber
                        min={0}
                        precision={2}
                        decimalSeparator=","
                        parser={parseCurrencyInput}
                        style={{ width: '100%' }}
                    />
                </FlexItem>
            </FormRow>
            <FormRow>
                <FlexItem
                    label="Taxa de Adm (R$)"
                    name={[fieldKey, 'fixedItems', 'administration_fee']}
                >
                    <InputNumber
                        min={0}
                        precision={2}
                        decimalSeparator=","
                        parser={parseCurrencyInput}
                        style={{ width: '100%' }}
                    />
                </FlexItem>
                <FlexItem
                    label="Taxa Bancária (R$)"
                    name={[fieldKey, 'fixedItems', 'bank_fee']}
                >
                    <InputNumber
                        min={0}
                        precision={2}
                        decimalSeparator=","
                        parser={parseCurrencyInput}
                        style={{ width: '100%' }}
                    />
                </FlexItem>
            </FormRow>

            {/* Form.List CORRETO para os Débitos Dinâmicos */}
            <Form.List name={[fieldKey, 'dynamicDebits']}>
                {(fields, { add, remove }) => (
                    <>
                        <DynamicItemList>
                            {fields.map((field) => {
                                const item = form.getFieldValue([
                                    'extracts',
                                    fieldKey,
                                    'dynamicDebits',
                                    field.name
                                ]);
                                if (!item) return null;
                                return (
                                    <DynamicItemRow key={field.key}>
                                        <Form.Item
                                            name={[field.name, 'category']}
                                            hidden
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name={[field.name, 'description']}
                                            hidden
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name={[field.name, 'amount']}
                                            hidden
                                        >
                                            <InputNumber />
                                        </Form.Item>
                                        <Form.Item
                                            name={[field.name, 'is_credit']}
                                            hidden
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name={[
                                                field.name,
                                                'is_withheld_at_source'
                                            ]}
                                            hidden
                                        >
                                            <Input />
                                        </Form.Item>

                                        <span>
                                            {item.description} (
                                            {item.is_withheld_at_source
                                                ? 'Retido'
                                                : 'Repassado'}
                                            )
                                        </span>
                                        <span>{formatBRL(item.amount)}</span>
                                        <DeleteOutlined
                                            onClick={() => remove(field.name)}
                                            className="delete-icon"
                                        />
                                    </DynamicItemRow>
                                );
                            })}
                        </DynamicItemList>
                        <Button
                            type="dashed"
                            icon={<PlusOutlined />}
                            onClick={() => openModal(false, add)}
                            block
                        >
                            Adicionar Despesa
                        </Button>
                    </>
                )}
            </Form.List>

            <Modal
                title={
                    modalConfig.isCredit
                        ? 'Adicionar Receita'
                        : 'Adicionar Despesa'
                }
                open={modalConfig.visible}
                onOk={handleAddItem}
                onCancel={() =>
                    setModalConfig({ ...modalConfig, visible: false })
                }
                destroyOnClose
                okText="Adicionar"
                cancelText="Cancelar"
            >
                <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                        <div style={{ marginBottom: 4, fontWeight: 500 }}>
                            Categoria
                        </div>
                        <Select
                            style={{ width: '100%' }}
                            value={newItem.category}
                            onChange={(category: ExtractItemCategory) =>
                                setNewItem((current) => ({
                                    ...current,
                                    category
                                }))
                            }
                            options={EXTRACT_DYNAMIC_CATEGORY_OPTIONS}
                        />
                    </div>
                    <div>
                        <div style={{ marginBottom: 4, fontWeight: 500 }}>
                            Descrição
                        </div>
                        <Input
                            value={newItem.description}
                            onChange={(event) =>
                                setNewItem((current) => ({
                                    ...current,
                                    description: event.target.value
                                }))
                            }
                        />
                    </div>
                    <div>
                        <div style={{ marginBottom: 4, fontWeight: 500 }}>
                            Valor (R$)
                        </div>
                        <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            precision={2}
                            decimalSeparator=","
                            parser={parseCurrencyInput}
                            value={newItem.amount}
                            onChange={(amount) =>
                                setNewItem((current) => ({
                                    ...current,
                                    amount: amount || 0
                                }))
                            }
                        />
                    </div>
                    <div>
                        <div style={{ marginBottom: 4, fontWeight: 500 }}>
                            Comportamento do Valor
                        </div>
                        <Radio.Group
                            style={{ width: '100%' }}
                            value={newItem.is_withheld_at_source}
                            onChange={(event) =>
                                setNewItem((current) => ({
                                    ...current,
                                    is_withheld_at_source: event.target.value
                                }))
                            }
                        >
                            <Radio.Button value style={{ width: '50%' }}>
                                Retido na Fonte
                            </Radio.Button>
                            <Radio.Button
                                value={false}
                                style={{ width: '50%' }}
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
