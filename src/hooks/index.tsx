import { ThemeProvider } from 'styled-components';
import { defaultTheme } from 'styles/default.theme';
import { AuthProvider } from './useAuth';

interface AppProviderProps {
    children: React.ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    return(
        <AuthProvider>
            <ThemeProvider theme={defaultTheme}>
                {children}
            </ThemeProvider>
        </AuthProvider>
    )
};

export default AppProvider;
