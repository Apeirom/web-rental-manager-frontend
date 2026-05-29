import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Switch, Input, Space, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { ITenant } from 'interfaces/tenant';
import { TenantService } from 'services/tenant_service';
import { TenantModal } from 'components/Modals/TenantModal';
import { TableContainer, Toolbar, FiltersArea } from '../sharedStyles';

export const TenantTable: React.FC = () => {
    const [tenants, setTenants] = useState<ITenant[]>([]);
    const [loading, setLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTenant, setEditingTenant] = useState<ITenant | null>(null);

    const [onlyActiveContracts, setOnlyActiveContracts] = useState(true);
    const [searchText, setSearchText] = useState('');

    const fetchTenants = useCallback(async () => {
        setLoading(true);
        try {
            const data = await TenantService.getAll();
            setTenants(data);
        } catch (error) {
            console.error('Erro ao carregar inquilinos', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTenants();
    }, [fetchTenants]);

    const filteredTenants = tenants.filter((tenant) => {
        // Futuro: Filtrar inquilinos com base no switch onlyActiveContracts usando o backend
        if (searchText) {
            const term = searchText.toLowerCase();
            return (
                tenant.name.toLowerCase().includes(term) ||
                tenant.document_number.includes(term)
            );
        }
        return true;
    });

    const columns = [
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: ITenant, b: ITenant) => a.name.localeCompare(b.name)
        },
        {
            title: 'Documento (CPF/CNPJ)',
            dataIndex: 'document_number',
            key: 'document_number'
        },
        {
            title: 'Ações',
            key: 'actions',
            align: 'right' as const,
            render: (_: any, record: ITenant) => (
                <Tooltip title="Editar Inquilino">
                    <Button
                        type="text"
                        icon={<EditOutlined style={{ color: '#0e90e2' }} />}
                        onClick={() => {
                            setEditingTenant(record);
                            setIsModalOpen(true);
                        }}
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
                        onSearch={setSearchText}
                        style={{ width: 280 }}
                    />
                    <Space>
                        <Switch
                            checked={onlyActiveContracts}
                            onChange={setOnlyActiveContracts}
                        />
                        <span style={{ fontSize: '14px', color: '#495057' }}>
                            Apenas em Contratos Ativos
                        </span>
                    </Space>
                </FiltersArea>

                <Space>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={fetchTenants}
                        loading={loading}
                    >
                        Atualizar
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setEditingTenant(null);
                            setIsModalOpen(true);
                        }}
                    >
                        Novo Inquilino
                    </Button>
                </Space>
            </Toolbar>

            <Table
                columns={columns}
                dataSource={filteredTenants}
                rowKey="key"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            {/* O Modal de criação que criamos anteriormente não suporta modo de edição ainda, 
                mas deixamos a prop pronta para quando você expandir os modais base */}
            <TenantModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchTenants}
            />
        </TableContainer>
    );
};
