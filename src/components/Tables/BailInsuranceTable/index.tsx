import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Switch, Input, Space, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { IBailInsurance } from 'interfaces/bail_insurance';
import { BailInsuranceService } from 'services/bail_insurance_service';
import { BailInsuranceModal } from 'components/Modals/BailInsuranceModal';
import { TableContainer, Toolbar, FiltersArea } from '../sharedStyles';

export const BailInsuranceTable: React.FC = () => {
    const [insurances, setInsurances] = useState<IBailInsurance[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [onlyActiveContracts, setOnlyActiveContracts] = useState(true);
    const [searchText, setSearchText] = useState('');

    const fetchInsurances = useCallback(async () => {
        setLoading(true);
        try {
            const data = await BailInsuranceService.getAll();
            setInsurances(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInsurances();
    }, [fetchInsurances]);

    const filtered = insurances.filter((i) => {
        if (searchText) {
            const term = searchText.toLowerCase();
            return i.insurance_company.toLowerCase().includes(term);
        }
        return true;
    });

    const columns = [
        {
            title: 'Seguradora',
            dataIndex: 'insurance_company',
            key: 'insurance_company',
            sorter: (a: IBailInsurance, b: IBailInsurance) =>
                a.insurance_company.localeCompare(b.insurance_company)
        },
        { title: 'Validade', dataIndex: 'validity', key: 'validity' },
        {
            title: 'Valor (R$)',
            dataIndex: 'value',
            key: 'value',
            render: (val: number) =>
                new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }).format(val)
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
                        placeholder="Buscar por seguradora..."
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
                        onClick={fetchInsurances}
                        loading={loading}
                    >
                        Atualizar
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsModalOpen(true)}
                    >
                        Novo Seguro Fiança
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
            <BailInsuranceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchInsurances}
            />
        </TableContainer>
    );
};
