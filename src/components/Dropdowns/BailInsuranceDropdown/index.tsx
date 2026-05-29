import React, { useState, useEffect } from 'react';
import { Select, Spin } from 'antd';
import { IBailInsurance } from 'interfaces/bail_insurance';
import { BailInsuranceService } from 'services/bail_insurance_service';
import { SelectContainer, Label } from '../sharedStyles';

interface BailInsuranceDropdownProps {
    value?: string | null;
    onChange?: (key: string) => void;
    placeholder?: string;
    label?: string;
    disabled?: boolean;
}

export const BailInsuranceDropdown: React.FC<BailInsuranceDropdownProps> = ({
    value,
    onChange,
    placeholder = 'Selecione o seguro fiança',
    label = 'Seguro Fiança',
    disabled
}) => {
    const [insurances, setInsurances] = useState<IBailInsurance[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await BailInsuranceService.getAll();
                setInsurances(data);
            } catch (error) {
                console.error('Erro ao carregar seguros', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Função auxiliar para formatar moeda (Opcional, mas ajuda muito visualmente)
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(val);
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
                options={insurances.map((i) => ({
                    value: i.key,
                    label: `${i.insurance_company} - ${formatCurrency(
                        i.value
                    )} (Val: ${i.validity})`
                }))}
                notFoundContent={
                    loading ? <Spin size="small" /> : 'Nenhum seguro encontrado'
                }
                style={{ width: '100%' }}
            />
        </SelectContainer>
    );
};
