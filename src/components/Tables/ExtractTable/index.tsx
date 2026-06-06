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
    ClockCircleOutlined
} from '@ant-design/icons';
import { IExtract } from 'interfaces/extract';
import { ExtractService } from 'services/extract_service';
import { ExtractModal } from 'components/Modals/ExtractModal';
import { ReconciliationModal } from 'components/Modals/ReconciliationModal';
import { TableContainer, Toolbar, FiltersArea } from '../sharedStyles';

const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(val);

export const ExtractTable: React.FC = () => {
    const [extracts, setExtracts] = useState<IExtract[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExtract, setEditingExtract] = useState<IExtract | null>(null);

    const [isReconcileModalOpen, setIsReconcileModalOpen] = useState(false);
    const [reconcilingExtract, setReconcilingExtract] =
        useState<IExtract | null>(null);

    const [onlyActiveContracts, setOnlyActiveContracts] = useState(true);
    const [searchText, setSearchText] = useState('');

    // NOVO ESTADO: Filtro de Conciliação
    const [isReconciledFilter, setIsReconciledFilter] = useState<
        boolean | null
    >(null);

    const [tableParams, setTableParams] = useState({
        current: 1,
        pageSize: 10
    });

    const handleCreateNew = () => {
        setEditingExtract(null);
        setIsModalOpen(true);
    };

    const handleEdit = (record: IExtract) => {
        setEditingExtract(record);
        setIsModalOpen(true);
    };

    const handleReconcile = (record: IExtract) => {
        setReconcilingExtract(record);
        setIsReconcileModalOpen(true);
    };

    const fetchExtracts = useCallback(async () => {
        setLoading(true);
        try {
            const skip = (tableParams.current - 1) * tableParams.pageSize;
            const response = await ExtractService.getPaginate({
                skip,
                limit: tableParams.pageSize,
                search_term: searchText || undefined,
                only_active_contracts: onlyActiveContracts,
                is_reconciled:
                    isReconciledFilter !== null ? isReconciledFilter : undefined
            });
            setExtracts(response.data);
            setTotal(response.total);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [onlyActiveContracts, searchText, isReconciledFilter, tableParams]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchExtracts();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [fetchExtracts]);

    const handleTableChange = (pagination: any) => {
        setTableParams({
            current: pagination.current,
            pageSize: pagination.pageSize
        });
    };

    const columns = [
        {
            title: 'Proprietário / Imóvel',
            key: 'property',
            render: (_: any, record: IExtract) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600 }}>
                        {record.contract.property.owner_name}
                    </span>
                    <small style={{ color: '#868e96' }}>
                        {record.contract.property.property_name}
                    </small>
                </div>
            )
        },
        {
            title: 'Ref.',
            key: 'reference',
            render: (_: any, record: IExtract) =>
                `${String(record.month_ref).padStart(2, '0')}/${
                    record.year_ref
                }`
        },
        {
            title: 'Taxa Adm',
            dataIndex: 'administration_fee',
            key: 'admin',
            render: (val: number) => (
                <span style={{ color: '#0e90e2' }}>{formatBRL(val)}</span>
            )
        },
        {
            title: 'Líquido Esperado',
            dataIndex: 'net_transfer',
            key: 'net',
            render: (val: number) => (
                <strong style={{ color: '#40c057' }}>{formatBRL(val)}</strong>
            )
        },
        {
            title: 'Status',
            key: 'status',
            render: (_: any, record: IExtract) => {
                const isReconciled = !!record.payment;
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
                    <Tooltip title="Ver Extrato">
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
            render: (_: any, record: IExtract) => {
                const isReconciled = !!record.payment;

                return (
                    <Space>
                        <Tooltip
                            title={
                                isReconciled
                                    ? 'Ver Conciliação'
                                    : 'Conciliar Pagamento Bancário'
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
                        <Tooltip title="Editar Extrato">
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

                    {/* NOVO FILTRO: Select de Conciliação */}
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
                        onClick={fetchExtracts}
                        loading={loading}
                    >
                        Atualizar
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateNew}
                    >
                        Novo Extrato
                    </Button>
                </Space>
            </Toolbar>
            <Table
                columns={columns}
                dataSource={extracts}
                rowKey="key"
                loading={loading}
                onChange={handleTableChange}
                pagination={{
                    current: tableParams.current,
                    pageSize: tableParams.pageSize,
                    total,
                    showSizeChanger: false
                }}
            />
            <ExtractModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchExtracts}
                initialData={editingExtract}
            />

            {reconcilingExtract && (
                <ReconciliationModal
                    isOpen={isReconcileModalOpen}
                    onClose={() => {
                        setIsReconcileModalOpen(false);
                        setReconcilingExtract(null);
                    }}
                    onSuccess={fetchExtracts}
                    extract={reconcilingExtract}
                />
            )}
        </TableContainer>
    );
};
