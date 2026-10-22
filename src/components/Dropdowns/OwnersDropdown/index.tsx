import React, { useState, useEffect } from 'react';
import { Select, Spin } from 'antd';
import { IOwner } from 'interfaces/owner';
import { OwnerService } from 'services/owner_service';
import { SelectContainer, Label } from '../sharedStyles';

interface OwnersDropdownProps {
    value?: string | null;
    onChange?: (key: string) => void;
    placeholder?: string;
    label?: string;
    disabled?: boolean;
    showDocument?: boolean;
    allowClear?: boolean;
    onClear?: () => void;
}

export const OwnersDropdown: React.FC<OwnersDropdownProps> = ({
    value,
    onChange,
    placeholder = 'Selecione um proprietário',
    label = 'Proprietário',
    disabled,
    showDocument = true,
    allowClear = false,
    onClear
}) => {
    const [owners, setOwners] = useState<IOwner[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchOwners = async (search?: string) => {
        setLoading(true);
        try {
            const response = await OwnerService.getPaginate({
                skip: 0,
                limit: 30,
                search_term: search || undefined
            });
            setOwners(response.data);
        } catch (error) {
            console.error('Erro ao carregar proprietários', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOwners();
    }, []);

    useEffect(() => {
        if (!value || owners.some((owner) => owner.key === value)) return;

        OwnerService.getByKey(value)
            .then((owner) => {
                setOwners((currentOwners) =>
                    currentOwners.some(
                        (currentOwner) => currentOwner.key === owner.key
                    )
                        ? currentOwners
                        : [...currentOwners, owner]
                );
            })
            .catch((error) =>
                console.error(
                    'Erro ao carregar proprietário selecionado',
                    error
                )
            );
    }, [owners, value]);

    return (
        <SelectContainer>
            {label && <Label>{label}</Label>}
            <Select
                showSearch
                filterOption={false}
                onSearch={(search) => fetchOwners(search)}
                value={value || undefined}
                placeholder={placeholder}
                allowClear={allowClear}
                disabled={disabled || loading}
                onChange={(selectedValue) => {
                    if (selectedValue) {
                        onChange?.(selectedValue);
                    } else {
                        onClear?.();
                    }
                }}
                options={owners.map((owner) => ({
                    value: owner.key,
                    label:
                        showDocument && owner.document_number
                            ? `${owner.name} (${owner.document_number})`
                            : owner.name
                }))}
                notFoundContent={
                    loading ? (
                        <Spin size="small" />
                    ) : (
                        'Nenhum proprietário encontrado'
                    )
                }
                style={{ width: '100%' }}
            />
        </SelectContainer>
    );
};
