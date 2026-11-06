import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Input, Space, Select, message } from 'antd';
import { PlusOutlined, ReloadOutlined, KeyOutlined } from '@ant-design/icons';
import { IUser } from 'interfaces/user';
import { UserService } from 'services/user_service';
import { UserModal } from 'components/Modals/UserModal';
import { ResetPasswordModal } from 'components/Modals/ResetPasswordModal';

export const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<IUser[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [resetUser, setResetUser] = useState<IUser | null>(null);

    const [tableParams, setTableParams] = useState({
        current: 1,
        pageSize: 10
    });

    const { current, pageSize } = tableParams;

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const skip = (current - 1) * pageSize;
            const response = await UserService.getPaginate({
                skip,
                limit: pageSize,
                search_term: searchText || undefined
            });
            setUsers(response.data);
            setTotal(response.total);
        } catch (error) {
            message.error('Erro ao carregar usuários.');
        } finally {
            setLoading(false);
        }
    }, [searchText, current, pageSize]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchUsers();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [fetchUsers]);

    const handleRoleChange = async (userKey: string, newRole: string) => {
        try {
            await UserService.updateRole(userKey, newRole);
            message.success('Permissão atualizada com sucesso!');
            fetchUsers();
        } catch (error) {
            message.error('Erro ao alterar permissão.');
        }
    };

    const columns = [
        { title: 'Nome', dataIndex: 'name', key: 'name' },
        { title: 'E-mail', dataIndex: 'email', key: 'email' },
        {
            title: 'Permissão (Role)',
            key: 'role',
            width: 180,
            render: (_: unknown, record: IUser) => (
                <Select
                    value={record.role}
                    style={{ width: '100%' }}
                    onChange={(val) => handleRoleChange(record.key, val)}
                    options={[
                        { value: 'user', label: 'Usuário Padrão' },
                        { value: 'master', label: 'Master' }
                    ]}
                />
            )
        },
        {
            title: 'Ações',
            key: 'actions',
            width: 160,
            render: (_: unknown, record: IUser) => (
                <Button
                    icon={<KeyOutlined />}
                    size="small"
                    onClick={() => setResetUser(record)}
                >
                    Redefinir Senha
                </Button>
            )
        }
    ];

    return (
        <div style={{ marginTop: 16 }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 16
                }}
            >
                <Input.Search
                    placeholder="Buscar por nome ou e-mail..."
                    allowClear
                    onChange={(e) => {
                        setSearchText(e.target.value);
                        setTableParams((prev) => ({ ...prev, current: 1 }));
                    }}
                    style={{ width: 300 }}
                />
                <Space>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={fetchUsers}
                        loading={loading}
                    >
                        Atualizar
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsModalOpen(true)}
                    >
                        Novo Usuário
                    </Button>
                </Space>
            </div>

            <Table
                columns={columns}
                dataSource={users}
                rowKey="key"
                loading={loading}
                pagination={{
                    current: tableParams.current,
                    pageSize: tableParams.pageSize,
                    total,
                    onChange: (page, newPageSize) =>
                        setTableParams({ current: page, pageSize: newPageSize })
                }}
            />

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchUsers}
            />

            <ResetPasswordModal
                isOpen={!!resetUser}
                user={resetUser}
                onClose={() => setResetUser(null)}
                onSuccess={fetchUsers}
            />
        </div>
    );
};
