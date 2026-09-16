// src/components/Modals/ExtractBatchModal/components/ExtractBatchTotals.tsx
import React from 'react';
import { Form, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { calculateExtractTotals, formatBRL } from 'utils/financial';
import { StickySummaryCard, SummaryItem } from './styles';
import { IFormExtract } from './types';

export const ExtractBatchTotals: React.FC = () => {
    return (
        <Form.Item shouldUpdate noStyle>
            {(formInstance) => {
                const extracts: IFormExtract[] =
                    formInstance.getFieldValue('extracts') || [];

                let totalAdminFee = 0;
                let totalNetTransfer = 0;

                extracts.forEach((ext) => {
                    if (ext) {
                        const { adminFee, netTransfer } =
                            calculateExtractTotals(ext);
                        totalAdminFee += adminFee;
                        totalNetTransfer += netTransfer;
                    }
                });

                return (
                    <StickySummaryCard>
                        <SummaryItem>
                            <span className="label">
                                Taxa Adm (Soma do Lote)
                                <Tooltip title="Soma das taxas de administração preenchidas no formulário">
                                    <InfoCircleOutlined
                                        style={{
                                            marginLeft: 4,
                                            cursor: 'help'
                                        }}
                                    />
                                </Tooltip>
                            </span>
                            <span className="value negative">
                                - {formatBRL(totalAdminFee)}
                            </span>
                        </SummaryItem>
                        <SummaryItem style={{ alignItems: 'flex-end' }}>
                            <span className="label">
                                Líquido Total Esperado
                            </span>
                            <span className="value positive">
                                {formatBRL(totalNetTransfer)}
                            </span>
                        </SummaryItem>
                    </StickySummaryCard>
                );
            }}
        </Form.Item>
    );
};
