import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Switch, Input, Tag, Space, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { IContract } from 'interfaces/contract';
import { ContractService } from 'services/contract_service';
import { ContractModal } from 'components/Modals/ContractModal';
import { TableContainer, Toolbar, FiltersArea } from '../sharedStyles';

export const ContractTable: React.FC = () => {
    const [contracts, setContracts] = useState<IContract[]>([]);
    const [loading, setLoading] = useState(false);

    // Estados do Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContract, setEditingContract] = useState<IContract | null>(
        null
    );

    // Estados dos Filtros
    const [onlyActiveContracts, setOnlyActiveContracts] = useState(true);
    const [searchText, setSearchText] = useState('');

    const fetchContracts = useCallback(async () => {
        setLoading(true);
        try {
            // Futuramente, passaremos os parâmetros de paginação e switch de ativos para o Service aqui!
            const data = await ContractService.getAll();
            setContracts(data);
        } catch (error) {
            console.error('Erro ao carregar contratos', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchContracts();
    }, [fetchContracts]);

    // Filtragem Local (Provisória até o backend estar 100% conectado com a paginação)
    const filteredContracts = contracts.filter((contract) => {
        // Filtro 1: Apenas Ativos (O seu switch futuro)
        if (onlyActiveContracts && contract.status !== 'active') return false;

        // Filtro 2: Busca por texto (Inquilino ou Imóvel)
        if (searchText) {
            const term = searchText.toLowerCase();
            const tenantMatch = contract.tenant.name
                .toLowerCase()
                .includes(term);
            const propertyMatch = contract.property.property_name
                .toLowerCase()
                .includes(term);
            if (!tenantMatch && !propertyMatch) return false;
        }

        return true;
    });

    const handleCreateNew = () => {
        setEditingContract(null);
        setIsModalOpen(true);
    };

    const handleEdit = (contract: IContract) => {
        setEditingContract(contract);
        setIsModalOpen(true);
    };

    // Definição das Colunas da Tabela do Ant Design
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
                        onSearch={setSearchText}
                        style={{ width: 280 }}
                    />

                    <Space>
                        <Switch
                            checked={onlyActiveContracts}
                            onChange={setOnlyActiveContracts}
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
                dataSource={filteredContracts}
                rowKey="key" // Importantíssimo para a performance do React
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            {/* O Modal super complexo que criamos! */}
            <ContractModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchContracts} // Quando salvar, recarrega a tabela automaticamente
                initialData={editingContract}
            />
        </TableContainer>
    );
};
