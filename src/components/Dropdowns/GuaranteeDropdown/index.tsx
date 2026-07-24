import React, { useState, useEffect } from 'react';
import { Select, Spin } from 'antd';
import { GuaranteeService } from 'services/guarantee_service';
import { IGuarantee } from 'interfaces/guarantee';
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
    preloadedOption?: IGuarantee | null; // A MÁGICA: Recebe a opção recém-criada
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

    const fetchGuarantees = async (search?: string) => {
        setLoading(true);
        try {
            const response = await GuaranteeService.getPaginate({
                skip: 0,
                limit: 30,
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

    // Monta as opções e garante que a opção recém-criada (ou do edit) esteja na lista!
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
                filterOption={false} // Desliga o filtro local (delega pro backend)
                onSearch={(val) => fetchGuarantees(val)} // Busca no backend
                allowClear
                disabled={disabled || loading}
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
