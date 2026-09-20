import React from 'react';
import { Form, Input, InputNumber, Select, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { parseCurrencyInput } from 'utils/formatters';
import { IGuarantee } from 'interfaces/guarantee';

// Dropdowns
import { TenantDropdown } from 'components/Dropdowns/TenantDropdown';
import { PropertyDropdown } from 'components/Dropdowns/PropertyDropdown';
import { RealEstateDropdown } from 'components/Dropdowns/RealEstateDropdown';
import { GuaranteeDropdown } from 'components/Dropdowns/GuaranteeDropdown';

import { DropdownRow } from './styles';

interface ContractFormFieldsProps {
    toggleModal: (
        modalName: 'tenant' | 'property' | 'realEstate' | 'guarantee',
        state: boolean
    ) => void;
    reloadGuaranteeDropdown: number;
    preloadedGuarantee: IGuarantee | null;
}

export const ContractFormFields: React.FC<ContractFormFieldsProps> = ({
    toggleModal,
    reloadGuaranteeDropdown,
    preloadedGuarantee
}) => {
    return (
        <>
            <DropdownRow>
                <Form.Item
                    name="tenant_key"
                    rules={[{ required: true, message: 'Obrigatório' }]}
                    style={{ marginBottom: 0 }}
                >
                    <TenantDropdown label="Inquilino" />
                </Form.Item>
                <Button
                    icon={<PlusOutlined />}
                    onClick={() => toggleModal('tenant', true)}
                />
            </DropdownRow>

            <DropdownRow>
                <Form.Item
                    name="property_key"
                    rules={[{ required: true, message: 'Obrigatório' }]}
                    style={{ marginBottom: 0 }}
                >
                    <PropertyDropdown label="Imóvel" />
                </Form.Item>
                <Button
                    icon={<PlusOutlined />}
                    onClick={() => toggleModal('property', true)}
                />
            </DropdownRow>

            <DropdownRow>
                <Form.Item name="real_estate_key" style={{ marginBottom: 0 }}>
                    <RealEstateDropdown label="Imobiliária (Opcional)" />
                </Form.Item>
                <Button
                    icon={<PlusOutlined />}
                    onClick={() => toggleModal('realEstate', true)}
                />
            </DropdownRow>

            <DropdownRow>
                <Form.Item name="guarantee_key" style={{ marginBottom: 0 }}>
                    <GuaranteeDropdown
                        label="Garantia"
                        reloadTrigger={reloadGuaranteeDropdown}
                        preloadedOption={preloadedGuarantee}
                    />
                </Form.Item>

                <Form.Item name="guarantee_type" hidden>
                    <Input />
                </Form.Item>

                <Button
                    icon={<PlusOutlined />}
                    onClick={() => toggleModal('guarantee', true)}
                />
            </DropdownRow>

            <div style={{ display: 'flex', gap: '16px' }}>
                <Form.Item
                    label="Valor do Aluguel (R$)"
                    name="rent_amount"
                    rules={[{ required: true }]}
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
                    label="Nome do Quarto"
                    name="room_name"
                    style={{ flex: 1 }}
                >
                    <Input placeholder="Ex: Suíte Master" />
                </Form.Item>
            </div>

            <Form.Item
                label="Status"
                name="status"
                initialValue="active"
                rules={[{ required: true }]}
            >
                <Select
                    options={[
                        { value: 'active', label: 'Ativo' },
                        { value: 'inactive', label: 'Inativo' }
                    ]}
                />
            </Form.Item>
        </>
    );
};
