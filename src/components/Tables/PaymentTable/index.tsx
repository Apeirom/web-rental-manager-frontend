import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, Tooltip, Tag } from 'antd';
import type { TablePaginationConfig } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    PlusOutlined,
    ReloadOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import { IPayment } from 'interfaces/payment';
import { PaymentService } from 'services/payment_service';
import { PaymentModal } from 'components/Modals/PaymentModal';
import { TableContainer, Toolbar, FiltersArea } from '../sharedStyles';
import {
    FilterInputNumber,
    FilterRangePicker,
    FilterSelect,
    StyledEditIcon
} from './styles';

export const PaymentTable: React.FC = () => {
    const [payments, setPayments] = useState<IPayment[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingPayment, setEditingPayment] = useState<IPayment | null>(null);

    const [amountFilter, setAmountFilter] = useState<number | null>(null);
    const [dateRange, setDateRange] = useState<[string, string] | null>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);

    const [tableParams, setTableParams] = useState({
        current: 1,
        pageSize: 10
    });

    const fetchPayments = useCallback(async () => {
        setLoading(true);
        try {
            const skip = (tableParams.current - 1) * tableParams.pageSize;

            const startDate =
                dateRange && dateRange[0] !== '' ? dateRange[0] : undefined;
            const endDate =
                dateRange && dateRange[1] !== '' ? dateRange[1] : undefined;

            let isLinkedParam: boolean | undefined;
            if (statusFilter === 'linked') isLinkedParam = true;
            if (statusFilter === 'unlinked') isLinkedParam = false;

            const response = await PaymentService.getPaginate({
                skip,
                limit: tableParams.pageSize,
                amount: amountFilter || undefined,
                start_date: startDate,
                end_date: endDate,
                is_linked: isLinkedParam
            });
            setPayments(response.data);
            setTotal(response.total);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [tableParams, dateRange, statusFilter, amountFilter]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchPayments();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [fetchPayments]);

    const handleTableChange = (pagination: TablePaginationConfig) => {
        setTableParams({
            current: pagination.current || 1,
            pageSize: pagination.pageSize || 10
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

    const columns: ColumnsType<IPayment> = [
        {
            title: 'Data do Pagamento',
            dataIndex: 'payment_date',
            key: 'payment_date',
            render: (date: string) =>
                new Date(`${date}T12:00:00Z`).toLocaleDateString('pt-BR')
        },
        {
            title: 'Valor Recebido',
            dataIndex: 'amount',
            key: 'amount',
            render: (val: number) =>
                new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }).format(val)
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag
                    color={status === 'linked' ? 'success' : 'warning'}
                    icon={
                        status === 'linked' ? (
                            <CheckCircleOutlined />
                        ) : (
                            <ClockCircleOutlined />
                        )
                    }
                >
                    {status === 'linked' ? 'Conciliado' : 'Pendente'}
                </Tag>
            )
        },
        {
            title: 'Ações',
            key: 'actions',
            align: 'right',
            render: (_, record: IPayment) => (
                <Tooltip title="Editar Pagamento">
                    <Button
                        type="text"
                        icon={<StyledEditIcon />}
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
                    <Space size="middle" wrap>
                        <FilterInputNumber
                            placeholder="Buscar por Valor (R$)"
                            onChange={(val) => {
                                setAmountFilter(
                                    val !== null ? Number(val) : null
                                );
                                setTableParams((prev) => ({
                                    ...prev,
                                    current: 1
                                }));
                            }}
                            decimalSeparator=","
                        />
                        <FilterRangePicker
                            placeholder={['Data Inicial', 'Data Final']}
                            format="YYYY-MM-DD"
                            onChange={(_, dateStrings) => {
                                if (
                                    dateStrings &&
                                    dateStrings[0] &&
                                    dateStrings[1]
                                ) {
                                    setDateRange([
                                        dateStrings[0],
                                        dateStrings[1]
                                    ]);
                                } else {
                                    setDateRange(null);
                                }
                                setTableParams((prev) => ({
                                    ...prev,
                                    current: 1
                                }));
                            }}
                        />
                        <FilterSelect
                            placeholder="Filtrar por Status"
                            allowClear
                            onChange={(val) => {
                                setStatusFilter(val as string | null);
                                setTableParams((prev) => ({
                                    ...prev,
                                    current: 1
                                }));
                            }}
                            options={[
                                { value: 'unlinked', label: 'Pendentes' },
                                { value: 'linked', label: 'Conciliados' }
                            ]}
                        />
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
                        Novo Recebimento
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
