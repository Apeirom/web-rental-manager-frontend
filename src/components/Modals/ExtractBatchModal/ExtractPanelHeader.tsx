// src/components/Modals/ExtractBatchModal/components/ExtractPanelHeader.tsx
import React from 'react';
import { Form } from 'antd';
import { calculateExtractTotals, formatBRL } from 'utils/financial';
import { IFormExtract } from './types';

interface ExtractPanelHeaderProps {
    fieldKey: number;
    index: number;
}

export const ExtractPanelHeader: React.FC<ExtractPanelHeaderProps> = ({
    fieldKey,
    index
}) => {
    return (
        <Form.Item shouldUpdate noStyle>
            {(formInstance) => {
                // Lê especificamente este extrato em tempo real
                const extract = formInstance.getFieldValue([
                    'extracts',
                    fieldKey
                ]) as IFormExtract;

                const { netTransfer } = calculateExtractTotals(extract || {});
                const isPositive = netTransfer >= 0;

                return (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                            alignItems: 'center'
                        }}
                    >
                        <span>
                            <strong>Extrato {index + 1}</strong>
                        </span>
                        <span
                            style={{
                                fontWeight: 600,
                                color: isPositive ? '#40c057' : '#fa5252',
                                backgroundColor: isPositive
                                    ? '#ebfbee'
                                    : '#fff5f5',
                                padding: '4px 10px',
                                borderRadius: '12px',
                                fontSize: '13px',
                                border: `1px solid ${
                                    isPositive ? '#b2f2bb' : '#ffc9c9'
                                }`
                            }}
                        >
                            Líquido: {formatBRL(netTransfer)}
                        </span>
                    </div>
                );
            }}
        </Form.Item>
    );
};
