import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Switch, Input, Space, Tooltip, Tag } from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    ReloadOutlined,
    FilePdfOutlined
} from '@ant-design/icons';
import { IExtract } from 'interfaces/extract';
import { ExtractService } from 'services/extract_service';
import { ExtractModal } from 'components/Modals/ExtractModal';
import { TableContainer, Toolbar, FiltersArea } from '../sharedStyles';

export const ExtractTable: React.FC = () => {
    const [extracts, setExtracts] = useState<IExtract[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExtract, setEditingExtract] = useState<IExtract | null>(null);
    const [onlyActiveContracts, setOnlyActiveContracts] = useState(true);
    const [searchText, setSearchText] = useState('');

    const fetchExtracts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await ExtractService.getAll();
            setExtracts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchExtracts();
    }, [fetchExtracts]);

    const formatBRL = (val: number) =>
        new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(val);

    const columns = [
        {
            title: 'Proprietário / Imóvel',
            key: 'property',
            render: (_: any, record: IExtract) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600 }}>
                        {record.contract.property.owner_name}
                    </span>
                    <small style={{ color: '#868e96' }}>
                        {record.contract.property.property_name}
                    </small>
                </div>
            )
        },
        {
            title: 'Ref.',
            key: 'reference',
            render: (_: any, record: IExtract) =>
                `${String(record.month_ref).padStart(2, '0')}/${
                    record.year_ref
                }`
        },
        {
            title: 'Comissão (Adm)',
            dataIndex: 'administration_fee',
            key: 'admin',
            render: (val: number) => (
                <span style={{ color: '#0e90e2' }}>{formatBRL(val)}</span>
            )
        },
        {
            title: 'Líquido Repassado',
            dataIndex: 'net_transfer',
            key: 'net',
            render: (val: number) => (
                <strong style={{ color: '#40c057' }}>{formatBRL(val)}</strong>
            )
        },
        {
            title: 'Doc',
            dataIndex: 'file_path',
            key: 'receipt',
            align: 'center' as const,
            render: (path: string) =>
                path ? (
                    <Tooltip title="Ver Comprovante">
                        <a href={path} target="_blank" rel="noreferrer">
                            <FilePdfOutlined
                                style={{ fontSize: '18px', color: '#fa5252' }}
                            />
                        </a>
                    </Tooltip>
                ) : (
                    '-'
                )
        },
        {
            title: 'Ações',
            key: 'actions',
            align: 'right' as const,
            render: (_: any, record: IExtract) => (
                <Tooltip title="Editar Extrato">
                    <Button
                        type="text"
                        icon={<EditOutlined style={{ color: '#0e90e2' }} />}
                        onClick={() => {
                            setEditingExtract(record);
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
                        placeholder="Buscar por proprietário ou imóvel..."
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
                        onClick={fetchExtracts}
                        loading={loading}
                    >
                        Atualizar
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setEditingExtract(null);
                            setIsModalOpen(true);
                        }}
                    >
                        Novo Extrato
                    </Button>
                </Space>
            </Toolbar>
            <Table
                columns={columns}
                dataSource={extracts}
                rowKey="key"
                loading={loading}
            />
            <ExtractModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchExtracts}
                initialData={editingExtract}
            />
        </TableContainer>
    );
};
