import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Switch, Input, Tag, Space, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { IContract } from 'interfaces/contract';
import { ContractService } from 'services/contract_service';
import { ContractModal } from 'components/Modals/ContractModal';
import { TableContainer, Toolbar, FiltersArea } from '../sharedStyles';

export const ContractTable: React.FC = () => {
    const [contracts, setContracts] = useState<IContract[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContract, setEditingContract] = useState<IContract | null>(
        null
    );
    const [onlyActiveContracts, setOnlyActiveContracts] = useState(true);
    const [searchText, setSearchText] = useState('');

    const [tableParams, setTableParams] = useState({
        current: 1,
        pageSize: 10
    });

    const fetchContracts = useCallback(async () => {
        setLoading(true);
        try {
            const skip = (tableParams.current - 1) * tableParams.pageSize;
            const response = await ContractService.getPaginate({
                skip,
                limit: tableParams.pageSize,
                status: onlyActiveContracts ? 'active' : undefined,
                search_term: searchText || undefined
            });
            setContracts(response.data);
            setTotal(response.total);
        } catch (error) {
            console.error('Erro ao carregar contratos', error);
        } finally {
            setLoading(false);
        }
    }, [onlyActiveContracts, searchText, tableParams]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchContracts();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [fetchContracts]);

    const handleTableChange = (pagination: any) => {
        setTableParams({
            current: pagination.current,
            pageSize: pagination.pageSize
        });
    };

    const handleCreateNew = () => {
        setEditingContract(null);
        setIsModalOpen(true);
    };

    const handleEdit = (contract: IContract) => {
        setEditingContract(contract);
        setIsModalOpen(true);
    };

    const columns = [
        {
            title: 'Inquilino',
            dataIndex: ['tenant', 'name'],
            key: 'tenant',
            sorter: (a: IContract, b: IContract) =>
                a.tenant.name.localeCompare(b.tenant.name)
        },
        {
            title: 'Imóvel',
            key: 'property',
            render: (_: any, record: IContract) => (
                <span>
                    {record.property.property_name}
                    {record.room_name ? ` (${record.room_name})` : ''}
                </span>
            )
        },
        {
            title: 'Aluguel (R$)',
            dataIndex: 'rent_amount',
            key: 'rent_amount',
            render: (value: number) =>
                new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }).format(value)
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'active' ? 'green' : 'red'}>
                    {status === 'active' ? 'Ativo' : 'Inativo'}
                </Tag>
            )
        },
        {
            title: 'Ações',
            key: 'actions',
            align: 'right' as const,
            render: (_: any, record: IContract) => (
                <Tooltip title="Editar Contrato">
                    <Button
                        type="text"
                        icon={<EditOutlined style={{ color: '#0e90e2' }} />}
                        onClick={() => handleEdit(record)}
                    />
                </Tooltip>
            )
        }
    ];

    return (
        <TableContainer>
            <Toolbar>
                <FiltersArea>
                    <Input.Search
                        placeholder="Buscar por inquilino ou imóvel..."
                        allowClear
                        onChange={(e) => {
                            setSearchText(e.target.value);
                            setTableParams((prev) => ({ ...prev, current: 1 }));
                        }}
                        style={{ width: 280 }}
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
                        onClick={fetchContracts}
                        loading={loading}
                    >
                        Atualizar
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateNew}
                    >
                        Novo Contrato
                    </Button>
                </Space>
            </Toolbar>

            <Table
                columns={columns}
                dataSource={contracts}
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

            <ContractModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchContracts}
                initialData={editingContract}
            />
        </TableContainer>
    );
};
