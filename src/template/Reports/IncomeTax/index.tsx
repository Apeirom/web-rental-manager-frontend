import React, { useState, useEffect } from 'react';

import Head from 'next/head';
import Link from 'next/link';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import { Button, Card, DatePicker, message, Select, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    ArrowLeftOutlined,
    DownloadOutlined,
    SearchOutlined
} from '@ant-design/icons';

import {
    INCOME_TAX_DEFAULT_PERIOD_DAYS,
    INCOME_TAX_TABLE_PAGE_SIZE,
    INCOME_TAX_TENANT_TYPE_PF,
    INCOME_TAX_TENANT_TYPE_OPTIONS,
    type IncomeTaxTenantType
} from 'constants/reports';
import { OwnersDropdown } from 'components/Dropdowns/OwnersDropdown';
import {
    type IIncomeTaxExtract,
    type IIncomeTaxReportParams,
    type IIncomeTaxSummary
} from 'interfaces/income_tax_report';
import { IncomeTaxReportService } from 'services/income_tax_report_service';
import { formatBRL, formatDate } from 'utils/formatters';
import { DashboardLayout } from 'components/DashboardLayout';
import {
    BackLink,
    Description,
    DetailGroup,
    ExtractDetails,
    FilterField,
    FilterGrid,
    FilterDatePickerContainer,
    FilterHint,
    FilterLabel,
    PageHeader,
    PeriodNote,
    ReportActions,
    ReportSectionTitle,
    SummaryCard,
    SummaryGrid,
    SummaryLabel,
    SummaryValue,
    Title
} from './styles';

interface IApiErrorResponse {
    detail?: {
        translation?: string;
    };
}

const getApiErrorMessage = async (
    error: unknown,
    fallback: string
): Promise<string> => {
    if (!axios.isAxiosError<unknown>(error)) return fallback;

    let responseData = error.response?.data;
    if (responseData instanceof Blob) {
        try {
            responseData = JSON.parse(await responseData.text()) as unknown;
        } catch {
            return fallback;
        }
    }

    if (
        typeof responseData === 'object' &&
        responseData !== null &&
        'detail' in responseData
    ) {
        const { detail } = responseData as IApiErrorResponse;
        if (typeof detail?.translation === 'string') {
            return detail.translation;
        }
    }

    return fallback;
};

const columns = (showOwner: boolean): ColumnsType<IIncomeTaxExtract> => {
    const reportColumns: ColumnsType<IIncomeTaxExtract> = [
        {
            title: 'Recebido em',
            dataIndex: 'payment_date',
            key: 'payment_date',
            render: (value: string) => formatDate(value)
        },
        {
            title: 'Referência',
            dataIndex: 'reference_date',
            key: 'reference_date'
        },
        {
            title: 'Imóvel',
            dataIndex: 'property_name',
            key: 'property_name'
        },
        {
            title: 'Inquilino',
            dataIndex: 'tenant_name',
            key: 'tenant_name'
        }
    ];

    if (showOwner) {
        reportColumns.push({
            title: 'Proprietário',
            dataIndex: 'owner_name',
            key: 'owner_name'
        });
    }

    reportColumns.push(
        {
            title: 'Participação',
            dataIndex: 'participation_percentage',
            key: 'participation_percentage',
            render: (value: number) => `${value.toFixed(2)}%`
        },
        {
            title: 'Rendimentos',
            dataIndex: 'total_income',
            key: 'total_income',
            render: (value: number) => formatBRL(value)
        },
        {
            title: 'Deduções',
            dataIndex: 'total_deductions',
            key: 'total_deductions',
            render: (value: number) => formatBRL(value)
        },
        {
            title: 'Base tributável',
            dataIndex: 'taxable_base',
            key: 'taxable_base',
            render: (value: number) => formatBRL(value)
        }
    );

    return reportColumns;
};

const IncomeTaxReportPage: React.FC = () => {
    const [ownerKey, setOwnerKey] = useState<string>();
    const [tenantType, setTenantType] = useState<IncomeTaxTenantType>(
        INCOME_TAX_TENANT_TYPE_PF
    );
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [summary, setSummary] = useState<IIncomeTaxSummary | null>(null);
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        const today = dayjs();
        setStartDate(today.subtract(INCOME_TAX_DEFAULT_PERIOD_DAYS - 1, 'day'));
        setEndDate(today);
    }, []);

    const requestParams = (): IIncomeTaxReportParams => ({
        owner_key: ownerKey,
        tenant_type: tenantType,
        start_date: startDate?.format('YYYY-MM-DD'),
        end_date: endDate?.format('YYYY-MM-DD')
    });

    const updateFilters = (update: () => void) => {
        setSummary(null);
        update();
    };

    const loadSummary = async () => {
        setLoading(true);
        try {
            const result = await IncomeTaxReportService.getSummary(
                requestParams()
            );
            setSummary(result);
        } catch (error: unknown) {
            console.error('Erro ao consultar o relatório Carnê-Leão', error);
            message.error(
                await getApiErrorMessage(
                    error,
                    'Não foi possível consultar o relatório. Verifique os filtros e tente novamente.'
                )
            );
            setSummary(null);
        } finally {
            setLoading(false);
        }
    };

    const exportCsv = async () => {
        if (!summary || summary.extracts.length === 0) {
            message.warning(
                'Consulte o relatório com lançamentos antes de baixar.'
            );
            return;
        }

        setExporting(true);
        try {
            const file = await IncomeTaxReportService.exportCsv({
                owner_key: ownerKey,
                tenant_type: tenantType,
                start_date: summary.start_date || undefined,
                end_date: summary.end_date
            });
            const url = window.URL.createObjectURL(file);
            const download = document.createElement('a');
            const start = summary.start_date || 'inicio';
            download.href = url;
            download.download = `carne-leao-${start}-ate-${summary.end_date}.csv`;
            document.body.appendChild(download);
            download.click();
            download.remove();
            window.URL.revokeObjectURL(url);
        } catch (error: unknown) {
            console.error('Erro ao exportar relatório Carnê-Leão', error);
            message.error(
                await getApiErrorMessage(
                    error,
                    'Não foi possível baixar o arquivo CSV.'
                )
            );
        } finally {
            setExporting(false);
        }
    };

    const rangeLabel = summary
        ? `${
              summary.start_date
                  ? formatDate(summary.start_date)
                  : 'Início do histórico'
          } até ${formatDate(summary.end_date)}`
        : '';

    return (
        <>
            <Head>
                <title>Carnê-Leão | Relatórios</title>
            </Head>
            <DashboardLayout>
                <PageHeader>
                    <Link href="/relatorios" passHref>
                        <BackLink>
                            <ArrowLeftOutlined />
                            Todos os relatórios
                        </BackLink>
                    </Link>
                    <Title>Carnê-Leão</Title>
                    <Description>
                        Visualize os valores recebidos no período, já rateados
                        conforme a participação de cada proprietário. Consulte a
                        prévia antes de exportar os lançamentos.
                    </Description>
                </PageHeader>

                <Card>
                    <FilterGrid>
                        <FilterField>
                            <OwnersDropdown
                                value={ownerKey}
                                label="Proprietário"
                                placeholder="Todos os proprietários"
                                showDocument={false}
                                allowClear
                                onClear={() =>
                                    updateFilters(() => setOwnerKey(undefined))
                                }
                                disabled={loading || exporting}
                                onChange={(value) =>
                                    updateFilters(() => setOwnerKey(value))
                                }
                            />
                        </FilterField>
                        <FilterField>
                            <FilterLabel htmlFor="income-tax-tenant-type">
                                Tipo de inquilino
                            </FilterLabel>
                            <Select<IncomeTaxTenantType>
                                id="income-tax-tenant-type"
                                value={tenantType}
                                options={INCOME_TAX_TENANT_TYPE_OPTIONS}
                                disabled={loading || exporting}
                                onChange={(value) =>
                                    updateFilters(() => setTenantType(value))
                                }
                            />
                        </FilterField>
                        <FilterField>
                            <FilterLabel htmlFor="income-tax-start-date">
                                Data inicial
                            </FilterLabel>
                            <FilterDatePickerContainer>
                                <DatePicker
                                    id="income-tax-start-date"
                                    aria-label="Data inicial"
                                    format="DD/MM/YYYY"
                                    value={startDate}
                                    allowClear
                                    disabled={loading || exporting}
                                    onChange={(value) =>
                                        updateFilters(() => setStartDate(value))
                                    }
                                />
                            </FilterDatePickerContainer>
                        </FilterField>
                        <FilterField>
                            <FilterLabel htmlFor="income-tax-end-date">
                                Data final
                            </FilterLabel>
                            <FilterDatePickerContainer>
                                <DatePicker
                                    id="income-tax-end-date"
                                    aria-label="Data final"
                                    format="DD/MM/YYYY"
                                    value={endDate}
                                    allowClear
                                    disabled={loading || exporting}
                                    onChange={(value) =>
                                        updateFilters(() => setEndDate(value))
                                    }
                                />
                            </FilterDatePickerContainer>
                        </FilterField>
                        <Button
                            type="primary"
                            icon={<SearchOutlined />}
                            loading={loading}
                            disabled={exporting}
                            onClick={loadSummary}
                        >
                            Consultar
                        </Button>
                    </FilterGrid>
                    <FilterHint>
                        Por padrão, são exibidos os últimos{' '}
                        {INCOME_TAX_DEFAULT_PERIOD_DAYS} dias, incluindo hoje. O
                        período considera a data do pagamento; deixe o
                        proprietário sem seleção para incluir todos. Você também
                        pode informar apenas uma das datas.
                    </FilterHint>
                </Card>

                {summary && (
                    <>
                        <PeriodNote>
                            Período consultado: {rangeLabel}. Os valores
                            correspondem a pagamentos recebidos nesse intervalo.
                            {summary.owner_name
                                ? ` Proprietário: ${summary.owner_name}.`
                                : ' Exibindo todos os proprietários, com valores rateados por participação.'}
                        </PeriodNote>
                        <SummaryGrid aria-label="Resumo do Carnê-Leão">
                            <SummaryCard>
                                <SummaryLabel>Rendimentos</SummaryLabel>
                                <SummaryValue>
                                    {formatBRL(summary.total_income)}
                                </SummaryValue>
                            </SummaryCard>
                            <SummaryCard>
                                <SummaryLabel>Deduções</SummaryLabel>
                                <SummaryValue>
                                    {formatBRL(summary.total_deductions)}
                                </SummaryValue>
                            </SummaryCard>
                            <SummaryCard>
                                <SummaryLabel>Base tributável</SummaryLabel>
                                <SummaryValue>
                                    {formatBRL(summary.taxable_base)}
                                </SummaryValue>
                            </SummaryCard>
                        </SummaryGrid>

                        <ReportActions>
                            <ReportSectionTitle>
                                Lançamentos recebidos
                            </ReportSectionTitle>
                            <Button
                                type="primary"
                                icon={<DownloadOutlined />}
                                loading={exporting}
                                disabled={
                                    loading || summary.extracts.length === 0
                                }
                                onClick={exportCsv}
                            >
                                Baixar CSV para e-CAC
                            </Button>
                        </ReportActions>

                        <Table<IIncomeTaxExtract>
                            columns={columns(!ownerKey)}
                            dataSource={summary.extracts}
                            rowKey={(row) =>
                                `${row.extract_key}:${row.owner_key}`
                            }
                            loading={loading}
                            pagination={{
                                pageSize: INCOME_TAX_TABLE_PAGE_SIZE
                            }}
                            scroll={{ x: true }}
                            locale={{
                                emptyText:
                                    'Nenhum pagamento recebido no período selecionado.'
                            }}
                            expandable={{
                                expandedRowRender: (row) => (
                                    <ExtractDetails>
                                        <DetailGroup>
                                            <h3>Rendimentos</h3>
                                            <ul>
                                                {row.income_items.map(
                                                    (item) => (
                                                        <li key={item.key}>
                                                            <span>
                                                                {
                                                                    item.description
                                                                }
                                                            </span>
                                                            <span>
                                                                {formatBRL(
                                                                    item.amount
                                                                )}
                                                            </span>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </DetailGroup>
                                        <DetailGroup>
                                            <h3>Deduções</h3>
                                            <ul>
                                                {row.deduction_items.map(
                                                    (item) => (
                                                        <li key={item.key}>
                                                            <span>
                                                                {
                                                                    item.description
                                                                }
                                                            </span>
                                                            <span>
                                                                {formatBRL(
                                                                    item.amount
                                                                )}
                                                            </span>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </DetailGroup>
                                    </ExtractDetails>
                                )
                            }}
                        />
                    </>
                )}
            </DashboardLayout>
        </>
    );
};

export default IncomeTaxReportPage;
