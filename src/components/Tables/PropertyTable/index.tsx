import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Switch, Input, Space, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { IProperty } from 'interfaces/property';
import { PropertyService } from 'services/property_service';
import { PropertyModal } from 'components/Modals/PropertyModal';
import { TableContainer, Toolbar, FiltersArea } from '../sharedStyles';

export const PropertyTable: React.FC = () => {
    const [properties, setProperties] = useState<IProperty[]>([]);
    const [loading, setLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [onlyActiveContracts, setOnlyActiveContracts] = useState(true);
    const [searchText, setSearchText] = useState('');

    const fetchProperties = useCallback(async () => {
        setLoading(true);
        try {
            const data = await PropertyService.getAll();
            setProperties(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    const filteredProperties = properties.filter((prop) => {
        if (searchText) {
            const term = searchText.toLowerCase();
            return (
                prop.property_name.toLowerCase().includes(term) ||
                prop.owner_name.toLowerCase().includes(term)
            );
        }
        return true;
    });

    const columns = [
        {
            title: 'Identificação',
            dataIndex: 'property_name',
            key: 'property_name',
            sorter: (a: IProperty, b: IProperty) =>
                a.property_name.localeCompare(b.property_name)
        },
        { title: 'Proprietário', dataIndex: 'owner_name', key: 'owner_name' },
        { title: 'Endereço', dataIndex: 'address', key: 'address' },
        {
            title: 'Quartos',
            dataIndex: 'room_count',
            key: 'room_count',
            align: 'center' as const
        },
        {
            title: 'Ações',
            key: 'actions',
            align: 'right' as const,
            render: (_: any, record: IProperty) => (
                <Tooltip title="Editar Imóvel">
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
                        placeholder="Buscar por imóvel ou proprietário..."
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
                        onClick={fetchProperties}
                        loading={loading}
                    >
                        Atualizar
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsModalOpen(true)}
                    >
                        Novo Imóvel
                    </Button>
                </Space>
            </Toolbar>

            <Table
                columns={columns}
                dataSource={filteredProperties}
                rowKey="key"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
            <PropertyModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchProperties}
            />
        </TableContainer>
    );
};
