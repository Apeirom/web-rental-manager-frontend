import React from 'react';
import { useAuth } from 'hooks/useAuth';
import { Sidebar } from 'components/Sidebar';
import { LayoutContainer, MainContent } from './styles';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    children
}) => {
    const { user, signOut } = useAuth();

    return (
        <LayoutContainer>
            <Sidebar user={user} onLogout={signOut} />
            <MainContent>{children}</MainContent>
        </LayoutContainer>
    );
};
