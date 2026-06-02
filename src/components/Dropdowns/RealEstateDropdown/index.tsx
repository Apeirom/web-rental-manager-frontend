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

    const fetchRealEstates = async (search?: string) => {
        setLoading(true);
        try {
            const response = await RealEstateService.getPaginate({
                skip: 0,
                limit: 30,
                search_term: search || undefined
            });
            setRealEstates(response.data);
        } catch (error) {
            console.error('Erro ao carregar imobiliárias', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRealEstates();
    }, []);

    return (
        <SelectContainer>
            {label && <Label>{label}</Label>}
            <Select
                showSearch
                filterOption={false}
                onSearch={(val) => fetchRealEstates(val)}
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
