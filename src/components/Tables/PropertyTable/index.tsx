import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Switch, Input, Space, Tooltip, Tag } from 'antd';
import type { TablePaginationConfig } from 'antd';
import { PlusOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { IProperty } from 'interfaces/property';
import { PropertyService } from 'services/property_service';
import { PropertyModal } from 'components/Modals/PropertyModal';
import {
    PROPERTY_TABLE_INITIAL_PAGE,
    PROPERTY_TABLE_PAGE_SIZE
} from 'constants/property_constants';
import { TableContainer, Toolbar, FiltersArea } from '../sharedStyles';

export const PropertyTable: React.FC = () => {
    const [properties, setProperties] = useState<IProperty[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProperty, setEditingProperty] = useState<IProperty | null>(
        null
    );

    const [onlyActiveContracts, setOnlyActiveContracts] = useState(false);
    const [searchText, setSearchText] = useState('');

    const [tableParams, setTableParams] = useState({
        current: PROPERTY_TABLE_INITIAL_PAGE,
        pageSize: PROPERTY_TABLE_PAGE_SIZE
    });

    const fetchProperties = useCallback(async () => {
        setLoading(true);
        try {
            const skip = (tableParams.current - 1) * tableParams.pageSize;
            const response = await PropertyService.getPaginate({
                skip,
                limit: tableParams.pageSize,
                search_term: searchText || undefined,
                only_active_contracts: onlyActiveContracts
            });
            setProperties(response.data);
            setTotal(response.total);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [onlyActiveContracts, searchText, tableParams]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchProperties();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [fetchProperties]);

    const handleTableChange = (pagination: TablePaginationConfig) => {
        setTableParams({
            current: pagination.current || PROPERTY_TABLE_INITIAL_PAGE,
            pageSize: pagination.pageSize || PROPERTY_TABLE_PAGE_SIZE
        });
    };

    const handleCreateNew = () => {
        setEditingProperty(null);
        setIsModalOpen(true);
    };

    const handleEdit = (record: IProperty) => {
        setEditingProperty(record);
        setIsModalOpen(true);
    };

    const columns = [
        {
            title: 'Identificação',
            dataIndex: 'property_name',
            key: 'property_name',
            sorter: (a: IProperty, b: IProperty) =>
                a.property_name.localeCompare(b.property_name)
        },
        {
            title: 'Proprietários',
            key: 'equity_participations',
            render: (_: unknown, record: IProperty) => {
                if (!record.equity_participations.length) {
                    return (
                        <Tag color="warning">Sem participação cadastrada</Tag>
                    );
                }
                return record.equity_participations
                    .map(
                        ({ owner, participation_percentage }) =>
                            `${owner.name} (${participation_percentage}%)`
                    )
                    .join(', ');
            }
        },
        { title: 'Endereço', dataIndex: 'address', key: 'address' },
        {
            title: 'Quartos',
            dataIndex: 'room_count',
            key: 'room_count',
            align: 'center' as const
        },
        {
            title: 'Ações',
            key: 'actions',
            align: 'right' as const,
            render: (_: unknown, record: IProperty) => (
                <Tooltip title="Editar Imóvel">
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
                        placeholder="Buscar por imóvel ou proprietário..."
                        allowClear
                        onChange={(e) => {
                            setSearchText(e.target.value);
                            setTableParams((prev) => ({
                                ...prev,
                                current: PROPERTY_TABLE_INITIAL_PAGE
                            }));
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
                                    current: PROPERTY_TABLE_INITIAL_PAGE
                                }));
                            }}
                        />
                        <span style={{ fontSize: '14px', color: '#495057' }}>
                            Apenas em Contratos Ativos
                        </span>
                    </Space>
                </FiltersArea>

                <Space>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={fetchProperties}
                        loading={loading}
                    >
                        Atualizar
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateNew}
                    >
                        Novo Imóvel
                    </Button>
                </Space>
            </Toolbar>

            <Table
                columns={columns}
                dataSource={properties}
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
            <PropertyModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchProperties}
                initialData={editingProperty}
            />
        </TableContainer>
    );
};
