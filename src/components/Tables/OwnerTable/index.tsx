import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Input, Space, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { IOwner } from 'interfaces/owner';
import { OwnerService } from 'services/owner_service';
import { OwnerModal } from 'components/Modals/OwnerModal';
import { TableContainer, Toolbar, FiltersArea } from '../sharedStyles';

export const OwnerTable: React.FC = () => {
    const [owners, setOwners] = useState<IOwner[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOwner, setEditingOwner] = useState<IOwner | null>(null);
    const [searchText, setSearchText] = useState('');
    const [tableParams, setTableParams] = useState({
        current: 1,
        pageSize: 10
    });

    const fetchOwners = useCallback(async () => {
        setLoading(true);
        try {
            const skip = (tableParams.current - 1) * tableParams.pageSize;
            const response = await OwnerService.getPaginate({
                skip,
                limit: tableParams.pageSize,
                search_term: searchText || undefined
            });
            setOwners(response.data);
            setTotal(response.total);
        } catch (error) {
            console.error('Erro ao carregar proprietários', error);
        } finally {
            setLoading(false);
        }
    }, [searchText, tableParams]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchOwners();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [fetchOwners]);

    const handleCreateNew = () => {
        setEditingOwner(null);
        setIsModalOpen(true);
    };

    const handleEdit = (record: IOwner) => {
        setEditingOwner(record);
        setIsModalOpen(true);
    };

    const columns = [
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: IOwner, b: IOwner) => a.name.localeCompare(b.name)
        },
        {
            title: 'Documento (CPF/CNPJ)',
            dataIndex: 'document_number',
            key: 'document_number',
            render: (documentNumber: string | null) => documentNumber || '-'
        },
        {
            title: 'Ações',
            key: 'actions',
            align: 'right' as const,
            render: (_: unknown, record: IOwner) => (
                <Tooltip title="Editar Proprietário">
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
                        onChange={(event) => {
                            setSearchText(event.target.value);
                            setTableParams((previous) => ({
                                ...previous,
                                current: 1
                            }));
                        }}
                        style={{ width: 280 }}
                    />
                </FiltersArea>
                <Space>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={fetchOwners}
                        loading={loading}
                    >
                        Atualizar
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateNew}
                    >
                        Novo Proprietário
                    </Button>
                </Space>
            </Toolbar>
            <Table
                columns={columns}
                dataSource={owners}
                rowKey="key"
                loading={loading}
                onChange={(pagination) => {
                    setTableParams({
                        current: pagination.current || 1,
                        pageSize: pagination.pageSize || 10
                    });
                }}
                pagination={{
                    current: tableParams.current,
                    pageSize: tableParams.pageSize,
                    total,
                    showSizeChanger: false
                }}
            />
            <OwnerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchOwners}
                initialData={editingOwner}
            />
        </TableContainer>
    );
};
