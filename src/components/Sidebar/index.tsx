import React from 'react';
import { useRouter } from 'next/router';
import { Menu } from 'antd';
import {
    AppstoreOutlined,
    LineChartOutlined,
    FilePdfOutlined,
    LogoutOutlined,
    UserOutlined
} from '@ant-design/icons';
import { IUser } from 'interfaces/user';
import {
    StyledSider,
    UserInfoContainer,
    UserEmail,
    MenuContainer,
    LogoutContainer
} from './styles';

interface SidebarProps {
    user: IUser | null;
    onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
    const router = useRouter();

    const menuItems = [
        {
            key: '/controle',
            icon: <AppstoreOutlined />,
            label: 'Controle'
        },
        {
            key: '/analises',
            icon: <LineChartOutlined />,
            label: 'Análises'
        },
        {
            key: '/relatorios',
            icon: <FilePdfOutlined />,
            label: 'Relatórios'
        }
    ];

    const handleNavigate = (route: string) => {
        router.push(route);
    };

    const handleLogout = () => {
        onLogout();
        router.replace('/');
    };

    return (
        <StyledSider width={260}>
            <UserInfoContainer>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#868e96'
                    }}
                >
                    <UserOutlined />
                    <span
                        style={{
                            fontSize: '12px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}
                    >
                        Logado como
                    </span>
                </div>
                <UserEmail>{user?.email || 'Carregando...'}</UserEmail>
            </UserInfoContainer>

            <MenuContainer>
                <Menu
                    mode="inline"
                    selectedKeys={[router.pathname]}
                    items={menuItems}
                    onClick={({ key }) => handleNavigate(key)}
                />
            </MenuContainer>

            <LogoutContainer>
                <button type="button" onClick={handleLogout}>
                    <LogoutOutlined />
                    Sair
                </button>
            </LogoutContainer>
        </StyledSider>
    );
};
