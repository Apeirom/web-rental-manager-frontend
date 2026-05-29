import React, { useState, useEffect } from 'react';
import { Select, Spin } from 'antd';
import { IContract } from 'interfaces/contract';
import { ContractService } from 'services/contract_service';
import { SelectContainer, Label } from '../sharedStyles';

interface ContractDropdownProps {
    value?: string | null;
    onChange?: (key: string) => void;
    placeholder?: string;
    label?: string;
    disabled?: boolean;
}

export const ContractDropdown: React.FC<ContractDropdownProps> = ({
    value,
    onChange,
    placeholder = 'Selecione o contrato',
    label = 'Contrato',
    disabled
}) => {
    const [contracts, setContracts] = useState<IContract[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchContracts = async () => {
            setLoading(true);
            try {
                // Aqui estamos buscando todos, mas em um cenário com milhares de contratos,
                // poderíamos usar a rota paginada com busca dinâmica que criamos no backend!
                const data = await ContractService.getAll();
                setContracts(data);
            } catch (error) {
                console.error('Erro ao carregar contratos', error);
            } finally {
                setLoading(false);
            }
        };
        fetchContracts();
    }, []);

    // Função para montar um texto bem descritivo para o usuário achar o contrato
    const formatContractLabel = (contract: IContract) => {
        const tenantName = contract.tenant.name;
        const propertyName = contract.property.property_name;
        const roomName = contract.room_name ? ` - ${contract.room_name}` : '';

        return `${tenantName} | ${propertyName}${roomName} (${
            contract.status === 'active' ? 'Ativo' : 'Inativo'
        })`;
    };

    return (
        <SelectContainer>
            {label && <Label>{label}</Label>}
            <Select
                showSearch={{
                    filterOption: (input, option) =>
                        (
                            option?.label?.toString().toLowerCase() ?? ''
                        ).includes(input.toLowerCase())
                }}
                value={value || undefined}
                placeholder={placeholder}
                disabled={disabled || loading}
                onChange={onChange}
                options={contracts.map((c) => ({
                    value: c.key,
                    label: formatContractLabel(c)
                }))}
                notFoundContent={
                    loading ? (
                        <Spin size="small" />
                    ) : (
                        'Nenhum contrato encontrado'
                    )
                }
                style={{ width: '100%' }}
            />
        </SelectContainer>
    );
};
