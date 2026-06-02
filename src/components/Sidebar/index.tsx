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
    LogoutContainer,
    ComingSoonBadge
} from './styles';

interface SidebarProps {
    user: IUser | null;
    onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
    const router = useRouter();

    const rawMenuItems = [
        {
            key: '/controle',
            icon: <AppstoreOutlined />,
            label: 'Controle',
            comingSoon: false
        },
        {
            key: '/analises',
            icon: <LineChartOutlined />,
            label: 'Análises',
            comingSoon: true
        },
        {
            key: '/relatorios',
            icon: <FilePdfOutlined />,
            label: 'Relatórios',
            comingSoon: true
        }
    ];

    const menuItems = rawMenuItems.map((item) => ({
        key: item.key,
        icon: item.icon,
        disabled: item.comingSoon,
        label: (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%'
                }}
            >
                <span>{item.label}</span>
                {item.comingSoon && <ComingSoonBadge>Em breve</ComingSoonBadge>}
            </div>
        )
    }));

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
