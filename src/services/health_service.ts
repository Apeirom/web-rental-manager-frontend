import { api } from './api';

export const HealthService = {
    checkRoot: async (): Promise<boolean> => {
        try {
            await api.get('/');
            return true;
        } catch (error) {
            return false;
        }
    },

    checkHealth: async (): Promise<boolean> => {
        try {
            await api.get('/health');
            return true;
        } catch (error) {
            return false;
        }
    },

    wakeUpServer: async (): Promise<boolean> => {
        try {
            const response = await api.get('/health');
            return response.status === 200;
        } catch (error) {
            console.warn('Servidor ainda está acordando...');
            return false;
        }
    }
};
