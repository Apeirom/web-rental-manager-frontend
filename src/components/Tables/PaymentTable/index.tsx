import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Switch, Input, Space, Tooltip, Tag } from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    ReloadOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import { IPayment } from 'interfaces/payment';
import { PaymentService } from 'services/payment_service';
import { PaymentModal } from 'components/Modals/PaymentModal';
import { TableContainer, Toolbar, FiltersArea } from '../sharedStyles';

export const PaymentTable: React.FC = () => {
    const [payments, setPayments] = useState<IPayment[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPayment, setEditingPayment] = useState<IPayment | null>(null);
    const [onlyActiveContracts, setOnlyActiveContracts] = useState(true);
    const [searchText, setSearchText] = useState('');

    const [tableParams, setTableParams] = useState({
        current: 1,
        pageSize: 10
    });

    const fetchPayments = useCallback(async () => {
        setLoading(true);
        try {
            const skip = (tableParams.current - 1) * tableParams.pageSize;
            const response = await PaymentService.getPaginate({
                skip,
                limit: tableParams.pageSize,
                search_term: searchText || undefined,
                only_active_contracts: onlyActiveContracts
            });
            setPayments(response.data);
            setTotal(response.total);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [onlyActiveContracts, searchText, tableParams]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchPayments();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [fetchPayments]);

    const handleTableChange = (pagination: any) => {
        setTableParams({
            current: pagination.current,
            pageSize: pagination.pageSize
        });
    };

    const handleCreateNew = () => {
        setEditingPayment(null);
        setIsModalOpen(true);
    };

    const handleEdit = (record: IPayment) => {
        setEditingPayment(record);
        setIsModalOpen(true);
    };

    const columns = [
        {
            title: 'Inquilino',
            dataIndex: ['contract', 'tenant', 'name'],
            key: 'tenant',
            sorter: (a: IPayment, b: IPayment) =>
                a.contract.tenant.name.localeCompare(b.contract.tenant.name)
        },
        {
            title: 'Imóvel',
            key: 'property',
            render: (_: any, record: IPayment) =>
                record.contract.property.property_name
        },
        {
            title: 'Ref.',
            key: 'reference',
            render: (_: any, record: IPayment) => (
                <Tag icon={<CalendarOutlined />}>
                    {String(record.month_ref).padStart(2, '0')}/
                    {record.year_ref}
                </Tag>
            )
        },
        {
            title: 'Data Pagto',
            dataIndex: 'payment_date',
            key: 'payment_date',
            render: (date: string) => new Date(date).toLocaleDateString('pt-BR')
        },
        {
            title: 'Valor Aluguel',
            dataIndex: ['contract', 'rent_amount'],
            key: 'amount',
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
            render: (_: any, record: IPayment) => (
                <Tooltip title="Editar Pagamento">
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
                        placeholder="Buscar inquilino ou imóvel..."
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
                        onClick={fetchPayments}
                        loading={loading}
                    >
                        Atualizar
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateNew}
                    >
                        Novo Pagamento
                    </Button>
                </Space>
            </Toolbar>
            <Table
                columns={columns}
                dataSource={payments}
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
            <PaymentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchPayments}
                initialData={editingPayment}
            />
        </TableContainer>
    );
};
