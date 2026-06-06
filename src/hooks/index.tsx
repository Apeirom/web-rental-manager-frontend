import React from 'react';
import { ThemeProvider } from 'styled-components';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/locale/pt_BR';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

import { defaultTheme } from 'styles/default.theme';
import { AuthProvider } from './useAuth';

dayjs.locale('pt-br');

interface AppProviderProps {
    children: React.ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    return (
        <AuthProvider>
            <ConfigProvider locale={ptBR}>
                <ThemeProvider theme={defaultTheme}>{children}</ThemeProvider>
            </ConfigProvider>
        </AuthProvider>
    );
};

export default AppProvider;
