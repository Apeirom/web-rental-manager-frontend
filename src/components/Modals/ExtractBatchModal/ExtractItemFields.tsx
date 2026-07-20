// src/components/Modals/ExtractBatchModal/components/ExtractItemFields.tsx
import React from 'react';
import { Form, Input, InputNumber } from 'antd';
import { parseCurrencyInput } from 'utils/formatters';
import { ContractDropdown } from '../../Dropdowns/ContractDropdown';
import { FormRow, FlexItem, SectionTitle } from './styles';

interface ExtractItemFieldsProps {
    fieldKey: number; // O index do array enviado pelo Form.List
}

// Auxiliar para facilitar a escrita
const CurrencyInput = ({
    label,
    name,
    fieldKey
}: {
    label: string;
    name: string;
    fieldKey: number;
}) => (
    <FlexItem label={label} name={[fieldKey, name]}>
        <InputNumber
            min={0}
            defaultValue={0}
            precision={2}
            decimalSeparator=","
            parser={parseCurrencyInput}
        />
    </FlexItem>
);

export const ExtractItemFields: React.FC<ExtractItemFieldsProps> = ({
    fieldKey
}) => {
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
                    <InputNumber min={1} max={12} placeholder="Ex: 5" />
                </FlexItem>
                <FlexItem
                    label="Ano Ref."
                    name={[fieldKey, 'year_ref']}
                    initialValue={2026}
                    rules={[{ required: true }]}
                >
                    <InputNumber min={1950} placeholder="Ex: 2026" />
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
            </FormRow>
            <FormRow>
                <CurrencyInput
                    fieldKey={fieldKey}
                    label="Juros (R$)"
                    name="interest"
                />
                <CurrencyInput
                    fieldKey={fieldKey}
                    label="Acordo (R$)"
                    name="agreement"
                />
            </FormRow>

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
                    label="Manutenção (R$)"
                    name="maintenance"
                />
                <CurrencyInput
                    fieldKey={fieldKey}
                    label="Outras Receitas (R$)"
                    name="other_revenues"
                />
            </FormRow>

            <Form.Item
                label="Taxa Bancária (TED/PIX/Boleto)"
                name={[fieldKey, 'bank_fee']}
            >
                <InputNumber
                    min={0}
                    precision={2}
                    defaultValue={0}
                    style={{ width: '50%' }}
                    decimalSeparator=","
                    parser={parseCurrencyInput}
                />
            </Form.Item>
        </>
    );
};
