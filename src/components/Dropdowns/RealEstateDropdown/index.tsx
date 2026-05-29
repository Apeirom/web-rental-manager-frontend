import React, { useState, useEffect } from 'react';
import { Select, Spin } from 'antd';
import { IRealEstate } from 'interfaces/real_estate';
import { RealEstateService } from 'services/real_estate_service';
import { SelectContainer, Label } from '../sharedStyles';

interface RealEstateDropdownProps {
    value?: string | null;
    onChange?: (key: string) => void;
    placeholder?: string;
    label?: string;
    disabled?: boolean;
}

export const RealEstateDropdown: React.FC<RealEstateDropdownProps> = ({
    value,
    onChange,
    placeholder = 'Selecione a imobiliária',
    label = 'Imobiliária',
    disabled
}) => {
    const [realEstates, setRealEstates] = useState<IRealEstate[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await RealEstateService.getAll();
                setRealEstates(data);
            } catch (error) {
                console.error('Erro ao carregar imobiliárias', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

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
                options={realEstates.map((re) => ({
                    value: re.key,
                    label: `${re.name} (${re.cnpj})`
                }))}
                notFoundContent={
                    loading ? (
                        <Spin size="small" />
                    ) : (
                        'Nenhuma imobiliária encontrada'
                    )
                }
                style={{ width: '100%' }}
            />
        </SelectContainer>
    );
};
