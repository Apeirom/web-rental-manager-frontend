import React, { useState, useEffect, useRef } from 'react';
import { Select, Spin } from 'antd';
import { IContract } from 'interfaces/contract';
import { ContractService } from 'services/contract_service';
import { useDebounce } from 'hooks/useDebounce';
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
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 400);
    const isFirstMount = useRef(true);

    const fetchContracts = async (search?: string) => {
        setLoading(true);
        try {
            const response = await ContractService.getPaginate({
                skip: 0,
                limit: 30,
                status: 'active',
                search_term: search || undefined
            });
            setContracts(response.data);
        } catch (error) {
            console.error('Erro ao carregar contratos', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContracts();
    }, []);

    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }
        fetchContracts(debouncedSearch);
    }, [debouncedSearch]);

    const formatContractLabel = (contract: IContract) => {
        const tenantName = contract.tenant?.name || 'Inquilino';
        const propertyName = contract.property?.property_name || 'Imóvel';
        const roomName = contract.room_name ? ` - ${contract.room_name}` : '';

        return `${tenantName} | ${propertyName}${roomName} (${
            contract.status === 'active' ? 'Ativo' : 'Inativo'
        })`;
    };

    return (
        <SelectContainer>
            {label && <Label>{label}</Label>}
            <Select
                showSearch
                filterOption={false}
                onSearch={setSearchTerm}
                value={value || undefined}
                placeholder={placeholder}
                loading={loading}
                disabled={disabled}
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
