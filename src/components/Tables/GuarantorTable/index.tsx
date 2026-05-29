import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Switch, Input, Space, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { IGuarantor } from 'interfaces/guarantor';
import { GuarantorService } from 'services/guarantor_service';
import { GuarantorModal } from 'components/Modals/GuarantorModal';
import { TableContainer, Toolbar, FiltersArea } from '../sharedStyles';

export const GuarantorTable: React.FC = () => {
    const [guarantors, setGuarantors] = useState<IGuarantor[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [onlyActiveContracts, setOnlyActiveContracts] = useState(true);
    const [searchText, setSearchText] = useState('');

    const fetchGuarantors = useCallback(async () => {
        setLoading(true);
        try {
            const data = await GuarantorService.getAll();
            setGuarantors(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGuarantors();
    }, [fetchGuarantors]);

    const filtered = guarantors.filter((g) => {
        if (searchText) {
            const term = searchText.toLowerCase();
            return (
                g.name.toLowerCase().includes(term) ||
                g.document_number.includes(term)
            );
        }
        return true;
    });

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
                        onClick={fetchGuarantors}
                        loading={loading}
                    >
                        Atualizar
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsModalOpen(true)}
                    >
                        Novo Fiador
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
            <GuarantorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchGuarantors}
            />
        </TableContainer>
    );
};
