import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Select, Space, Tooltip, Tag } from 'antd';
import { PlusOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { formatBRL, formatDate } from 'utils/formatters';

import { IGuarantee, GuaranteeTypeEnum } from 'interfaces/guarantee';
import { GuaranteeService } from 'services/guarantee_service';
import { GuaranteeModal } from 'components/Modals/GuaranteeModal';
import { TableContainer, Toolbar, FiltersArea } from '../sharedStyles';

export const GuaranteeTable: React.FC = () => {
    const [guarantees, setGuarantees] = useState<IGuarantee[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGuarantee, setEditingGuarantee] = useState<IGuarantee | null>(
        null
    );

    // Novo filtro por Tipo
    const [typeFilter, setTypeFilter] = useState<GuaranteeTypeEnum | ''>('');

    const [tableParams, setTableParams] = useState({
        current: 1,
        pageSize: 10
    });

    const fetchGuarantees = useCallback(async () => {
        setLoading(true);
        try {
            const skip = (tableParams.current - 1) * tableParams.pageSize;
            const response = await GuaranteeService.getPaginate({
                skip,
                limit: tableParams.pageSize,
                guarantee_type: typeFilter || undefined
            });
            setGuarantees(response.data);
            setTotal(response.total);
        } catch (error) {
            console.error('Erro ao buscar garantias:', error);
        } finally {
            setLoading(false);
        }
    }, [typeFilter, tableParams]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchGuarantees();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [fetchGuarantees]);

    const handleTableChange = (pagination: any) => {
        setTableParams({
            current: pagination.current,
            pageSize: pagination.pageSize
        });
    };

    const handleCreateNew = () => {
        setEditingGuarantee(null);
        setIsModalOpen(true);
    };

    const handleEdit = (record: IGuarantee) => {
        setEditingGuarantee(record);
        setIsModalOpen(true);
    };

    // Configuração dinâmica das colunas dependendo do tipo
    const columns = [
        {
            title: 'Tipo',
            dataIndex: 'type',
            key: 'type',
            width: 150,
            render: (type: GuaranteeTypeEnum) => {
                const typeMap: Record<
                    GuaranteeTypeEnum,
                    { label: string; color: string }
                > = {
                    deposit: { label: 'Caução', color: 'green' },
                    guarantor: { label: 'Fiador', color: 'blue' },
                    bail_insurance: { label: 'Seguro Fiança', color: 'purple' }
                };
                const config = typeMap[type];
                return <Tag color={config.color}>{config.label}</Tag>;
            }
        },
        {
            title: 'Identificação / Referência',
            key: 'identification',
            render: (_: any, record: IGuarantee) => {
                if (record.type === 'guarantor')
                    return <strong>{record.name}</strong>;
                if (record.type === 'bail_insurance')
                    return <strong>{record.insurance_company}</strong>;
                if (record.type === 'deposit') return <em>Depósito Caução</em>;
                return '-';
            }
        },
        {
            title: 'Valor / Documento',
            key: 'value_doc',
            render: (_: any, record: IGuarantee) => {
                if (record.type === 'guarantor') return record.document_number;
                if (record.type === 'bail_insurance')
                    return formatBRL(record.value);
                if (record.type === 'deposit') return formatBRL(record.amount);
                return '-';
            }
        },
        {
            title: 'Informação Adicional',
            key: 'extra_info',
            render: (_: any, record: IGuarantee) => {
                if (record.type === 'bail_insurance') {
                    return `Válido até: ${record.validity}`;
                }
                if (record.type === 'deposit') {
                    const status = record.paid_in_cash
                        ? 'Dinheiro Vivo'
                        : 'Transferência/Boleto';
                    const date = record.deposit_date
                        ? ` em ${formatDate(record.deposit_date)}`
                        : '';
                    return (
                        <span style={{ color: '#868e96', fontSize: '13px' }}>
                            {status}
                            {date}
                        </span>
                    );
                }
                return '-';
            }
        },
        {
            title: 'Ações',
            key: 'actions',
            align: 'right' as const,
            width: 100,
            render: (_: any, record: IGuarantee) => (
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
                    <span
                        style={{
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#495057'
                        }}
                    >
                        Filtrar por:
                    </span>
                    <Select
                        placeholder="Todos os Tipos"
                        allowClear
                        style={{ width: 220 }}
                        onChange={(value) => {
                            setTypeFilter(value || '');
                            setTableParams((prev) => ({ ...prev, current: 1 }));
                        }}
                        options={[
                            { value: 'deposit', label: 'Caução (Depósito)' },
                            { value: 'guarantor', label: 'Fiador' },
                            { value: 'bail_insurance', label: 'Seguro Fiança' }
                        ]}
                    />
                </FiltersArea>
                <Space>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={fetchGuarantees}
                        loading={loading}
                    >
                        Atualizar
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateNew}
                    >
                        Nova Garantia
                    </Button>
                </Space>
            </Toolbar>

            <Table
                columns={columns}
                dataSource={guarantees}
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

            <GuaranteeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchGuarantees}
                initialData={editingGuarantee}
            />
        </TableContainer>
    );
};
