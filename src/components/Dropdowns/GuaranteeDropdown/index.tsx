import React, { useState, useEffect, useRef } from 'react';
import { Select, Spin } from 'antd';
import { GuaranteeService } from 'services/guarantee_service';
import { IGuarantee } from 'interfaces/guarantee';
import { useDebounce } from 'hooks/useDebounce';
import { SelectContainer, Label } from '../sharedStyles';

const formatBRL = (val: number): string =>
    new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(val);

interface GuaranteeDropdownProps {
    value?: string | null;
    onChange?: (key: string) => void;
    label?: string;
    disabled?: boolean;
    reloadTrigger?: number;
    preloadedOption?: IGuarantee | null;
}

export const GuaranteeDropdown: React.FC<GuaranteeDropdownProps> = ({
    value,
    onChange,
    label = 'Garantia',
    disabled = false,
    reloadTrigger = 0,
    preloadedOption
}) => {
    const [guarantees, setGuarantees] = useState<IGuarantee[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 400);
    const isFirstMount = useRef(true);

    const fetchGuarantees = async (search?: string) => {
        setLoading(true);
        try {
            const response = await GuaranteeService.getPaginate({
                skip: 0,
                limit: 30,
                guarantee_types: ['guarantor', 'bail_insurance'],
                search_term: search || undefined
            });
            setGuarantees(response.data);
        } catch (error) {
            console.error('Erro ao carregar garantias', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGuarantees();
    }, [reloadTrigger]);

    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }
        fetchGuarantees(debouncedSearch);
    }, [debouncedSearch]);

    const formatOptionLabel = (g: IGuarantee) => {
        if (g.type === 'deposit') return `Caução: ${formatBRL(g.amount)}`;
        if (g.type === 'guarantor')
            return `Fiador: ${g.name} (${g.document_number})`;
        if (g.type === 'bail_insurance')
            return `Seguro Fiança: ${g.insurance_company} - ${formatBRL(
                g.value
            )}`;
        return 'Garantia Desconhecida';
    };

    const options = guarantees.map((g) => ({
        value: g.key,
        label: formatOptionLabel(g)
    }));

    if (
        preloadedOption &&
        !guarantees.find((g) => g.key === preloadedOption.key)
    ) {
        options.unshift({
            value: preloadedOption.key,
            label: formatOptionLabel(preloadedOption)
        });
    }

    return (
        <SelectContainer>
            {label && <Label>{label}</Label>}
            <Select
                showSearch
                filterOption={false}
                onSearch={setSearchTerm}
                allowClear
                loading={loading}
                disabled={disabled}
                placeholder="Selecione uma garantia"
                value={value || undefined}
                onChange={onChange}
                notFoundContent={
                    loading ? (
                        <Spin size="small" />
                    ) : (
                        'Nenhuma garantia encontrada'
                    )
                }
                options={options}
                style={{ width: '100%' }}
            />
        </SelectContainer>
    );
};
