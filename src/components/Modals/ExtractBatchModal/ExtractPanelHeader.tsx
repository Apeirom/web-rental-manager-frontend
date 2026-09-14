// src/components/Modals/ExtractBatchModal/components/ExtractPanelHeader.tsx
import React from 'react';
import { Form } from 'antd';
import { calculateExtractTotals } from 'utils/financial';
import { formatBRL } from 'utils/formatters';
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
        <Form.Item noStyle dependencies={[['extracts', fieldKey]]}>
            {({ getFieldValue }) => {
                const extract: IFormExtract = getFieldValue([
                    'extracts',
                    fieldKey
                ]);

                const { netTransfer } = calculateExtractTotals(extract);
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
