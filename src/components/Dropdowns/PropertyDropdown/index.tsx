import React, { useState, useEffect, useRef } from 'react';
import { Select, Spin } from 'antd';
import { IProperty } from 'interfaces/property';
import { PropertyService } from 'services/property_service';
import { useDebounce } from 'hooks/useDebounce';
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
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 400);
    const isFirstMount = useRef(true);

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

    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }
        fetchProperties(debouncedSearch);
    }, [debouncedSearch]);

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
