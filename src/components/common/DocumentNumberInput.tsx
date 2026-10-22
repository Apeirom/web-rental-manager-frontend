import React from 'react';
import { Input, InputProps } from 'antd';

type DocumentNumberInputProps = Omit<InputProps, 'value' | 'onChange'> & {
    value?: string;
    onChange?: (value: string) => void;
    documentType?: 'cpf-cnpj' | 'cnpj';
};

const formatDocumentNumber = (
    value: string,
    documentType: 'cpf-cnpj' | 'cnpj'
): string => {
    const digits = value.replace(/\D/g, '').slice(0, 14);

    if (documentType === 'cnpj' || digits.length > 11) {
        return digits
            .replace(/^(\d{2})(\d)/, '$1.$2')
            .replace(/^(\d{2}\.\d{3})(\d)/, '$1.$2')
            .replace(/^(\d{2}\.\d{3}\.\d{3})(\d)/, '$1/$2')
            .replace(/^(\d{2}\.\d{3}\.\d{3}\/\d{4})(\d)/, '$1-$2');
    }

    return digits
        .replace(/^(\d{3})(\d)/, '$1.$2')
        .replace(/^(\d{3}\.\d{3})(\d)/, '$1.$2')
        .replace(/^(\d{3}\.\d{3}\.\d{3})(\d)/, '$1-$2');
};

export const DocumentNumberInput: React.FC<DocumentNumberInputProps> = ({
    value,
    onChange,
    documentType = 'cpf-cnpj',
    ...inputProps
}) => (
    <Input
        {...inputProps}
        value={value || ''}
        maxLength={18}
        onChange={(event) =>
            onChange?.(formatDocumentNumber(event.target.value, documentType))
        }
    />
);
