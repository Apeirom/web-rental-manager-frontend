import React, { useState, useEffect } from 'react';
import { Select, Spin } from 'antd';
import { IGuarantor } from 'interfaces/guarantor';
import { GuarantorService } from 'services/guarantor_service';
import { SelectContainer, Label } from '../sharedStyles';

interface GuarantorDropdownProps {
    value?: string | null;
    onChange?: (key: string) => void;
    placeholder?: string;
    label?: string;
    disabled?: boolean;
}

export const GuarantorDropdown: React.FC<GuarantorDropdownProps> = ({
    value,
    onChange,
    placeholder = 'Selecione o fiador',
    label = 'Fiador',
    disabled
}) => {
    const [guarantors, setGuarantors] = useState<IGuarantor[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchGuarantors = async (search?: string) => {
        setLoading(true);
        try {
            const response = await GuarantorService.getPaginate({
                skip: 0,
                limit: 30,
                search_term: search || undefined
            });
            setGuarantors(response.data);
        } catch (error) {
            console.error('Erro ao carregar fiadores', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGuarantors();
    }, []);

    return (
        <SelectContainer>
            {label && <Label>{label}</Label>}
            <Select
                showSearch
                filterOption={false}
                onSearch={(val) => fetchGuarantors(val)}
                value={value || undefined}
                placeholder={placeholder}
                disabled={disabled || loading}
                onChange={onChange}
                options={guarantors.map((g) => ({
                    value: g.key,
                    label: `${g.name} (${g.document_number})`
                }))}
                notFoundContent={
                    loading ? <Spin size="small" /> : 'Nenhum fiador encontrado'
                }
                style={{ width: '100%' }}
            />
        </SelectContainer>
    );
};
