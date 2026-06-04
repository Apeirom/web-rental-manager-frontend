import React from 'react';
import { Tabs } from 'antd';
import { useAuth } from 'hooks/useAuth';
import { MyProfileForm } from 'components/Profile/MyProfileForm';
import { UserManagement } from 'components/Profile/UserManagement';
import { DashboardLayout } from 'components/DashboardLayout';

export default function ProfilePage() {
    const { user } = useAuth();

    const items = [
        {
            key: '1',
            label: 'Meus Dados',
            children: <MyProfileForm />
        }
    ];

    if (user?.role === 'master') {
        items.push({
            key: '2',
            label: 'Gerenciamento de Usuários (Master)',
            children: <UserManagement />
        });
    }

    return (
        <DashboardLayout>
            <div
                style={{
                    background: '#fff',
                    padding: '24px',
                    borderRadius: '8px'
                }}
            >
                <Tabs defaultActiveKey="1" items={items} />
            </div>
        </DashboardLayout>
    );
}
