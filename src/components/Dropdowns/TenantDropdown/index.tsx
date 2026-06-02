import React, { useState, useEffect } from 'react';
import { Select, Spin } from 'antd';
import { ITenant } from 'interfaces/tenant';
import { TenantService } from 'services/tenant_service';
import { SelectContainer, Label } from '../sharedStyles';

interface TenantDropdownProps {
    value?: string | null;
    onChange?: (key: string) => void;
    placeholder?: string;
    label?: string;
    disabled?: boolean;
}

export const TenantDropdown: React.FC<TenantDropdownProps> = ({
    value,
    onChange,
    placeholder = 'Selecione um inquilino',
    label = 'Inquilino',
    disabled
}) => {
    const [tenants, setTenants] = useState<ITenant[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchTenants = async (search?: string) => {
        setLoading(true);
        try {
            const response = await TenantService.getPaginate({
                skip: 0,
                limit: 30,
                search_term: search || undefined
            });
            setTenants(response.data);
        } catch (error) {
            console.error('Erro ao carregar inquilinos', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTenants();
    }, []);

    return (
        <SelectContainer>
            {label && <Label>{label}</Label>}
            <Select
                showSearch
                filterOption={false}
                onSearch={(val) => fetchTenants(val)}
                value={value || undefined}
                placeholder={placeholder}
                disabled={disabled || loading}
                onChange={onChange}
                options={tenants.map((t) => ({
                    value: t.key,
                    label: `${t.name} (${t.document_number})`
                }))}
                notFoundContent={
                    loading ? (
                        <Spin size="small" />
                    ) : (
                        'Nenhum inquilino encontrado'
                    )
                }
                style={{ width: '100%' }}
            />
        </SelectContainer>
    );
};
