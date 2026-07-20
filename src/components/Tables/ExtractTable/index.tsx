import React, { useState, useEffect, useCallback } from 'react';
import {
    Table,
    Button,
    Switch,
    Input,
    Space,
    Tooltip,
    Select,
    Tag
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    ReloadOutlined,
    FilePdfOutlined,
    ApiOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    FolderOpenOutlined
} from '@ant-design/icons';
import type { TablePaginationConfig } from 'antd';

// Imports atualizados para a arquitetura de Batch
import { IExtractBatch, IExtract } from 'interfaces/extract';
import { ExtractBatchService } from 'services/extract_service';
import { ExtractBatchModal } from 'components/Modals/ExtractBatchModal';
import { ReconciliationModal } from 'components/Modals/ReconciliationModal';

// Imports de estilos
import {
    TableContainer,
    Toolbar,
    FiltersArea,
    InfoStack,
    MoneyText,
    ExpandedTableWrapper
} from './styles';

const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(val || 0);

export const ExtractTable: React.FC = () => {
    // ESTADOS AGORA GUARDAM "BATCHES"
    const [batches, setBatches] = useState<IExtractBatch[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBatch, setEditingBatch] = useState<IExtractBatch | null>(
        null
    );

    const [isReconcileModalOpen, setIsReconcileModalOpen] = useState(false);
    const [reconcilingBatch, setReconcilingBatch] =
        useState<IExtractBatch | null>(null);

    const [onlyActiveContracts, setOnlyActiveContracts] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [isReconciledFilter, setIsReconciledFilter] = useState<
        boolean | null
    >(null);

    const [tableParams, setTableParams] = useState({
        current: 1,
        pageSize: 10
    });

    const handleCreateNew = () => {
        setEditingBatch(null);
        setIsModalOpen(true);
    };

    const handleEdit = (record: IExtractBatch) => {
        setEditingBatch(record);
        setIsModalOpen(true);
    };

    const handleReconcile = (record: IExtractBatch) => {
        setReconcilingBatch(record);
        setIsReconcileModalOpen(true);
    };

    const fetchBatches = useCallback(async () => {
        setLoading(true);
        try {
            const skip = (tableParams.current - 1) * tableParams.pageSize;
            const response = await ExtractBatchService.getPaginate({
                skip,
                limit: tableParams.pageSize,
                search_term: searchText || undefined,
                only_active_contracts: onlyActiveContracts,
                is_reconciled:
                    isReconciledFilter !== null ? isReconciledFilter : undefined
            });
            setBatches(response.data);
            setTotal(response.total);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [onlyActiveContracts, searchText, isReconciledFilter, tableParams]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchBatches();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [fetchBatches]);

    const handleTableChange = (pagination: TablePaginationConfig) => {
        setTableParams({
            current: pagination.current || 1,
            pageSize: pagination.pageSize || 10
        });
    };

    // ==========================================
    // COLUNAS DA TABELA PRINCIPAL (Lote/Batch)
    // ==========================================
    const columns = [
        {
            title: 'Lote / Contratos',
            key: 'contracts',
            render: (_: unknown, record: IExtractBatch) => {
                const count = record.extracts.length;
                if (count === 1) {
                    const prop = record.extracts[0].contract.property;
                    return (
                        <InfoStack>
                            <span className="primary-text">
                                {prop.owner_name}
                            </span>
                            <span className="secondary-text">
                                {prop.property_name}
                            </span>
                        </InfoStack>
                    );
                }
                return (
                    <InfoStack>
                        <span className="primary-text">
                            <FolderOpenOutlined style={{ marginRight: 6 }} />
                            Lote Múltiplo ({count})
                        </span>
                        <span className="secondary-text">
                            Expanda para ver os detalhes
                        </span>
                    </InfoStack>
                );
            }
        },
        {
            title: 'Ref.',
            key: 'reference',
            render: (_: unknown, record: IExtractBatch) => {
                if (record.extracts.length === 0) return '-';
                // Mostra a referência do primeiro extrato (geralmente lotes são do mesmo mês)
                const first = record.extracts[0];
                return `${String(first.month_ref).padStart(2, '0')}/${
                    first.year_ref
                }`;
            }
        },
        {
            title: 'Líquido Total',
            dataIndex: 'total_net_transfer',
            key: 'total_net_transfer',
            render: (val: number) => (
                <MoneyText $variant="positive">{formatBRL(val)}</MoneyText>
            )
        },
        {
            title: 'Status',
            key: 'status',
            render: (_: unknown, record: IExtractBatch) => {
                const isReconciled = record.status === 'linked';
                return (
                    <Tag
                        color={isReconciled ? 'success' : 'warning'}
                        icon={
                            isReconciled ? (
                                <CheckCircleOutlined />
                            ) : (
                                <ClockCircleOutlined />
                            )
                        }
                    >
                        {isReconciled ? 'Conciliado' : 'Pendente'}
                    </Tag>
                );
            }
        },
        {
            title: 'Doc',
            dataIndex: 'file_path',
            key: 'receipt',
            align: 'center' as const,
            render: (path: string) =>
                path ? (
                    <Tooltip title="Ver Comprovante">
                        <a href={path} target="_blank" rel="noreferrer">
                            <FilePdfOutlined
                                style={{ fontSize: '18px', color: '#fa5252' }}
                            />
                        </a>
                    </Tooltip>
                ) : (
                    '-'
                )
        },
        {
            title: 'Ações',
            key: 'actions',
            align: 'right' as const,
            render: (_: unknown, record: IExtractBatch) => {
                const isReconciled = record.status === 'linked';
                return (
                    <Space>
                        <Tooltip
                            title={
                                isReconciled
                                    ? 'Ver Pagamento Vinculado'
                                    : 'Conciliar Pagamento'
                            }
                        >
                            <Button
                                type={isReconciled ? 'text' : 'primary'}
                                ghost={isReconciled}
                                size="large"
                                icon={
                                    <ApiOutlined
                                        style={{
                                            color: isReconciled
                                                ? '#0e90e2'
                                                : undefined
                                        }}
                                    />
                                }
                                onClick={() => handleReconcile(record)}
                            />
                        </Tooltip>
                        <Tooltip title="Editar Lote">
                            <Button
                                type="text"
                                icon={
                                    <EditOutlined
                                        style={{ color: '#0e90e2' }}
                                    />
                                }
                                onClick={() => handleEdit(record)}
                            />
                        </Tooltip>
                    </Space>
                );
            }
        }
    ];

    // ==========================================
    // COLUNAS DA SUB-TABELA (Extratos Internos)
    // ==========================================
    const expandedRowRender = (batch: IExtractBatch) => {
        const subColumns = [
            {
                title: 'Proprietário / Imóvel',
                key: 'property',
                render: (_: unknown, record: IExtract) => (
                    <InfoStack>
                        <span className="primary-text">
                            {record.contract.property.owner_name}
                        </span>
                        <span className="secondary-text">
                            {record.contract.property.property_name} (
                            {record.contract.room_name})
                        </span>
                    </InfoStack>
                )
            },
            {
                title: 'Ref.',
                key: 'ref',
                render: (_: unknown, record: IExtract) =>
                    `${String(record.month_ref).padStart(2, '0')}/${
                        record.year_ref
                    }`
            },
            {
                title: 'Aluguel Bruto',
                dataIndex: 'rent_amount',
                key: 'rent',
                render: (val: number) => <MoneyText>{formatBRL(val)}</MoneyText>
            },
            {
                title: 'Taxa Adm',
                dataIndex: 'administration_fee',
                key: 'admin',
                render: (val: number) => <MoneyText>{formatBRL(val)}</MoneyText>
            },
            {
                title: 'Líquido',
                dataIndex: 'net_transfer',
                key: 'net',
                render: (val: number) => (
                    <MoneyText $variant="positive">{formatBRL(val)}</MoneyText>
                )
            }
        ];

        return (
            <ExpandedTableWrapper>
                <Table
                    columns={subColumns}
                    dataSource={batch.extracts}
                    rowKey="key"
                    pagination={false}
                    size="small"
                />
            </ExpandedTableWrapper>
        );
    };

    return (
        <TableContainer>
            <Toolbar>
                <FiltersArea>
                    <Input.Search
                        placeholder="Buscar por proprietário ou imóvel..."
                        allowClear
                        onChange={(e) => {
                            setSearchText(e.target.value);
                            setTableParams((prev) => ({ ...prev, current: 1 }));
                        }}
                        style={{ width: 280 }}
                    />
                    <Select
                        placeholder="Filtrar por Status"
                        allowClear
                        style={{ width: 180 }}
                        onChange={(val) => {
                            setIsReconciledFilter(
                                val !== undefined ? val : null
                            );
                            setTableParams((prev) => ({ ...prev, current: 1 }));
                        }}
                        options={[
                            { value: false, label: 'Pendentes' },
                            { value: true, label: 'Conciliados' }
                        ]}
                    />
                    <Space>
                        <Switch
                            checked={onlyActiveContracts}
                            onChange={(checked) => {
                                setOnlyActiveContracts(checked);
                                setTableParams((prev) => ({
                                    ...prev,
                                    current: 1
                                }));
                            }}
                        />
                        <span style={{ fontSize: '14px', color: '#495057' }}>
                            Apenas Contratos Ativos
                        </span>
                    </Space>
                </FiltersArea>

                <Space>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={fetchBatches}
                        loading={loading}
                    >
                        Atualizar
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateNew}
                    >
                        Novo Lote / Extrato
                    </Button>
                </Space>
            </Toolbar>

            <Table
                columns={columns}
                dataSource={batches}
                rowKey="key"
                loading={loading}
                onChange={handleTableChange}
                // Habilita a sub-tabela expansível
                expandable={{ expandedRowRender }}
                pagination={{
                    current: tableParams.current,
                    pageSize: tableParams.pageSize,
                    total,
                    showSizeChanger: false
                }}
            />

            <ExtractBatchModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchBatches}
                initialData={editingBatch}
            />

            {reconcilingBatch && (
                <ReconciliationModal
                    isOpen={isReconcileModalOpen}
                    onClose={() => {
                        setIsReconcileModalOpen(false);
                        setReconcilingBatch(null);
                    }}
                    onSuccess={fetchBatches}
                    batch={reconcilingBatch}
                />
            )}
        </TableContainer>
    );
};
