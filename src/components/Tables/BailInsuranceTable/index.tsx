import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Switch, Input, Space, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { IBailInsurance } from 'interfaces/bail_insurance';
import { BailInsuranceService } from 'services/bail_insurance_service';
import { BailInsuranceModal } from 'components/Modals/BailInsuranceModal';
import { TableContainer, Toolbar, FiltersArea } from '../sharedStyles';

export const BailInsuranceTable: React.FC = () => {
    const [insurances, setInsurances] = useState<IBailInsurance[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingInsurance, setEditingInsurance] =
        useState<IBailInsurance | null>(null);
    const [onlyActiveContracts, setOnlyActiveContracts] = useState(false);
    const [searchText, setSearchText] = useState('');

    const [tableParams, setTableParams] = useState({
        current: 1,
        pageSize: 10
    });

    const fetchInsurances = useCallback(async () => {
        setLoading(true);
        try {
            const skip = (tableParams.current - 1) * tableParams.pageSize;
            const response = await BailInsuranceService.getPaginate({
                skip,
                limit: tableParams.pageSize,
                search_term: searchText || undefined,
                only_active_contracts: onlyActiveContracts
            });
            setInsurances(response.data);
            setTotal(response.total);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [onlyActiveContracts, searchText, tableParams]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchInsurances();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [fetchInsurances]);

    const handleTableChange = (pagination: any) => {
        setTableParams({
            current: pagination.current,
            pageSize: pagination.pageSize
        });
    };

    const handleCreateNew = () => {
        setEditingInsurance(null);
        setIsModalOpen(true);
    };

    const handleEdit = (record: IBailInsurance) => {
        setEditingInsurance(record);
        setIsModalOpen(true);
    };

    const columns = [
        {
            title: 'Seguradora',
            dataIndex: 'insurance_company',
            key: 'insurance_company',
            sorter: (a: IBailInsurance, b: IBailInsurance) =>
                a.insurance_company.localeCompare(b.insurance_company)
        },
        { title: 'Validade', dataIndex: 'validity', key: 'validity' },
        {
            title: 'Valor (R$)',
            dataIndex: 'value',
            key: 'value',
            render: (val: number) =>
                new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }).format(val)
        },
        {
            title: 'Ações',
            key: 'actions',
            align: 'right' as const,
            render: (_: any, record: IBailInsurance) => (
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
                        placeholder="Buscar por seguradora..."
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
                        onClick={fetchInsurances}
                        loading={loading}
                    >
                        Atualizar
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateNew}
                    >
                        Novo Seguro Fiança
                    </Button>
                </Space>
            </Toolbar>
            <Table
                columns={columns}
                dataSource={insurances}
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
            <BailInsuranceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchInsurances}
                initialData={editingInsurance}
            />
        </TableContainer>
    );
};
