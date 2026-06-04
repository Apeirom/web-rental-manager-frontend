import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Switch, Input, Space, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { IRealEstate } from 'interfaces/real_estate';
import { RealEstateService } from 'services/real_estate_service';
import { RealEstateModal } from 'components/Modals/RealEstateModal';
import { fromApiPercentage } from 'utils/formatters';
import { TableContainer, Toolbar, FiltersArea } from '../sharedStyles';

export const RealEstateTable: React.FC = () => {
    const [realEstates, setRealEstates] = useState<IRealEstate[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRealEstate, setEditingRealEstate] =
        useState<IRealEstate | null>(null);

    const [onlyActiveContracts, setOnlyActiveContracts] = useState(false);
    const [searchText, setSearchText] = useState('');

    const [tableParams, setTableParams] = useState({
        current: 1,
        pageSize: 10
    });

    const fetchRealEstates = useCallback(async () => {
        setLoading(true);
        try {
            const skip = (tableParams.current - 1) * tableParams.pageSize;
            const response = await RealEstateService.getPaginate({
                skip,
                limit: tableParams.pageSize,
                search_term: searchText || undefined,
                only_active_contracts: onlyActiveContracts
            });
            setRealEstates(response.data);
            setTotal(response.total);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [onlyActiveContracts, searchText, tableParams]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchRealEstates();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [fetchRealEstates]);

    const handleTableChange = (pagination: any) => {
        setTableParams({
            current: pagination.current,
            pageSize: pagination.pageSize
        });
    };

    const handleCreateNew = () => {
        setEditingRealEstate(null);
        setIsModalOpen(true);
    };

    const handleEdit = (record: IRealEstate) => {
        setEditingRealEstate(record);
        setIsModalOpen(true);
    };

    const columns = [
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: IRealEstate, b: IRealEstate) =>
                a.name.localeCompare(b.name)
        },
        { title: 'CNPJ', dataIndex: 'cnpj', key: 'cnpj' },
        {
            title: 'Taxa adm(%)',
            dataIndex: 'commission',
            key: 'commission',
            render: (val: number) => `${fromApiPercentage(val)}%`
        },
        { title: 'Telefone', dataIndex: 'phone', key: 'phone' },
        {
            title: 'Ações',
            key: 'actions',
            align: 'right' as const,
            render: (_: any, record: IRealEstate) => (
                <Tooltip title="Editar">
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
                        placeholder="Buscar por nome ou CNPJ..."
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
                            Apenas em Contratos Ativos
                        </span>
                    </Space>
                </FiltersArea>
                <Space>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={fetchRealEstates}
                        loading={loading}
                    >
                        Atualizar
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateNew}
                    >
                        Nova Imobiliária
                    </Button>
                </Space>
            </Toolbar>
            <Table
                columns={columns}
                dataSource={realEstates}
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
            <RealEstateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchRealEstates}
                initialData={editingRealEstate}
            />
        </TableContainer>
    );
};
