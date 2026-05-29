import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Switch, Input, Space, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { IRealEstate } from 'interfaces/real_estate';
import { RealEstateService } from 'services/real_estate_service';
import { RealEstateModal } from 'components/Modals/RealEstateModal';
import { TableContainer, Toolbar, FiltersArea } from '../sharedStyles';

export const RealEstateTable: React.FC = () => {
    const [realEstates, setRealEstates] = useState<IRealEstate[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [onlyActiveContracts, setOnlyActiveContracts] = useState(true);
    const [searchText, setSearchText] = useState('');

    const fetchRealEstates = useCallback(async () => {
        setLoading(true);
        try {
            const data = await RealEstateService.getAll();
            setRealEstates(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRealEstates();
    }, [fetchRealEstates]);

    const filtered = realEstates.filter((re) => {
        if (searchText) {
            const term = searchText.toLowerCase();
            return (
                re.name.toLowerCase().includes(term) || re.cnpj.includes(term)
            );
        }
        return true;
    });

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
            title: 'Taxa (%)',
            dataIndex: 'commission',
            key: 'commission',
            render: (val: number) => `${val}%`
        },
        { title: 'Telefone', dataIndex: 'phone', key: 'phone' },
        {
            title: 'Ações',
            key: 'actions',
            align: 'right' as const,
            render: () => (
                <Tooltip title="Editar">
                    <Button
                        type="text"
                        icon={<EditOutlined style={{ color: '#0e90e2' }} />}
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
                        onClick={fetchRealEstates}
                        loading={loading}
                    >
                        Atualizar
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsModalOpen(true)}
                    >
                        Nova Imobiliária
                    </Button>
                </Space>
            </Toolbar>
            <Table
                columns={columns}
                dataSource={filtered}
                rowKey="key"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
            <RealEstateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchRealEstates}
            />
        </TableContainer>
    );
};
