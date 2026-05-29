import React, { createContext, useContext, useState, useEffect } from 'react';
import { IUser } from 'interfaces/user';
import { AuthService } from 'services/auth_service';
import { api } from 'services/api';

interface AuthContextData {
    user: IUser | null;
    isAuthenticated: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children
}) => {
    const [user, setUser] = useState<IUser | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('@RentalManager:token');
        const userData = localStorage.getItem('@RentalManager:user');

        if (token && userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const signIn = async (email: string, password: string) => {
        try {
            const loginResponse = await AuthService.login(email, password);
            const loggedUser: IUser = loginResponse.user;
            const accessToken: string = loginResponse.token.access_token;

            localStorage.setItem('@RentalManager:token', accessToken);
            localStorage.setItem(
                '@RentalManager:user',
                JSON.stringify(loggedUser)
            );

            api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
            setUser(loggedUser);
        } catch (error) {
            console.error('Erro ao fazer login', error);
            throw error;
        }
    };

    const signOut = () => {
        localStorage.removeItem('@RentalManager:token');
        localStorage.removeItem('@RentalManager:user');
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, isAuthenticated: !!user, signIn, signOut }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};
