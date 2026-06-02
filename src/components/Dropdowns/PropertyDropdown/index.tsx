import React, { useState, useEffect } from 'react';
import { Select, Spin } from 'antd';
import { IProperty } from 'interfaces/property';
import { PropertyService } from 'services/property_service';
import { SelectContainer, Label } from '../sharedStyles';

interface PropertyDropdownProps {
    value?: string | null;
    onChange?: (key: string) => void;
    placeholder?: string;
    label?: string;
    disabled?: boolean;
}

export const PropertyDropdown: React.FC<PropertyDropdownProps> = ({
    value,
    onChange,
    placeholder = 'Selecione o imóvel',
    label = 'Imóvel',
    disabled
}) => {
    const [properties, setProperties] = useState<IProperty[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchProperties = async (search?: string) => {
        setLoading(true);
        try {
            const response = await PropertyService.getPaginate({
                skip: 0,
                limit: 30,
                search_term: search || undefined
            });
            setProperties(response.data);
        } catch (error) {
            console.error('Erro ao carregar imóveis', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    return (
        <SelectContainer>
            {label && <Label>{label}</Label>}
            <Select
                showSearch
                filterOption={false}
                onSearch={(val) => fetchProperties(val)}
                value={value || undefined}
                placeholder={placeholder}
                disabled={disabled || loading}
                onChange={onChange}
                options={properties.map((p) => ({
                    value: p.key,
                    label: `${p.property_name} - ${p.address} (${p.room_count} quartos)`
                }))}
                notFoundContent={
                    loading ? <Spin size="small" /> : 'Nenhum imóvel encontrado'
                }
                style={{ width: '100%' }}
            />
        </SelectContainer>
    );
};
