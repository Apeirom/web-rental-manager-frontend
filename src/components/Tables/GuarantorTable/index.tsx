import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Switch, Input, Space, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { IGuarantor } from 'interfaces/guarantor';
import { GuarantorService } from 'services/guarantor_service';
import { GuarantorModal } from 'components/Modals/GuarantorModal';
import { TableContainer, Toolbar, FiltersArea } from '../sharedStyles';

export const GuarantorTable: React.FC = () => {
    const [guarantors, setGuarantors] = useState<IGuarantor[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGuarantor, setEditingGuarantor] = useState<IGuarantor | null>(
        null
    );
    const [onlyActiveContracts, setOnlyActiveContracts] = useState(false);
    const [searchText, setSearchText] = useState('');

    const [tableParams, setTableParams] = useState({
        current: 1,
        pageSize: 10
    });

    const fetchGuarantors = useCallback(async () => {
        setLoading(true);
        try {
            const skip = (tableParams.current - 1) * tableParams.pageSize;
            const response = await GuarantorService.getPaginate({
                skip,
                limit: tableParams.pageSize,
                search_term: searchText || undefined,
                only_active_contracts: onlyActiveContracts
            });
            setGuarantors(response.data);
            setTotal(response.total);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [onlyActiveContracts, searchText, tableParams]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchGuarantors();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [fetchGuarantors]);

    const handleTableChange = (pagination: any) => {
        setTableParams({
            current: pagination.current,
            pageSize: pagination.pageSize
        });
    };

    const handleCreateNew = () => {
        setEditingGuarantor(null);
        setIsModalOpen(true);
    };

    const handleEdit = (record: IGuarantor) => {
        setEditingGuarantor(record);
        setIsModalOpen(true);
    };

    const columns = [
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: IGuarantor, b: IGuarantor) =>
                a.name.localeCompare(b.name)
        },
        {
            title: 'Documento',
            dataIndex: 'document_number',
            key: 'document_number'
        },
        {
            title: 'Ações',
            key: 'actions',
            align: 'right' as const,
            render: (_: any, record: IGuarantor) => (
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
                        placeholder="Buscar por nome ou documento..."
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
                        onClick={fetchGuarantors}
                        loading={loading}
                    >
                        Atualizar
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateNew}
                    >
                        Novo Fiador
                    </Button>
                </Space>
            </Toolbar>
            <Table
                columns={columns}
                dataSource={guarantors}
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
            <GuarantorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchGuarantors}
                initialData={editingGuarantor}
            />
        </TableContainer>
    );
};
