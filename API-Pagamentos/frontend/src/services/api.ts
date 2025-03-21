import axios from 'axios';
import { ApiResponse, User, CreditCard, PaymentMethod, LoginCredentials } from '../types';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Serviços de Autenticação
export const authService = {
    login: async (credentials: LoginCredentials): Promise<ApiResponse<{ token: string; user: User }>> => {
        try {
            const response = await api.post('/auth/login', credentials);
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: 'Erro ao fazer login',
            };
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
};

// Serviços de Usuário
export const userService = {
    create: async (user: Omit<User, 'id'>): Promise<ApiResponse<User>> => {
        try {
            const response = await api.post('/users', user);
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: 'Erro ao criar usuário',
            };
        }
    },

    getAll: async (): Promise<ApiResponse<User[]>> => {
        try {
            const response = await api.get('/users');
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: 'Erro ao buscar usuários',
            };
        }
    },

    getById: async (id: number): Promise<ApiResponse<User>> => {
        try {
            const response = await api.get(`/users/${id}`);
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: 'Erro ao buscar usuário',
            };
        }
    },

    delete: async (id: number): Promise<ApiResponse<void>> => {
        try {
            const response = await api.delete(`/users/${id}`);
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: 'Erro ao deletar usuário',
            };
        }
    }
};

// Serviços de Cartão de Crédito
export const creditCardService = {
    create: async (card: Omit<CreditCard, 'id'>): Promise<ApiResponse<CreditCard>> => {
        try {
            const response = await api.post('/credit-cards', card);
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: 'Erro ao criar cartão de crédito',
            };
        }
    },

    getAll: async (userId: number): Promise<ApiResponse<CreditCard[]>> => {
        try {
            const response = await api.get(`/credit-cards?userId=${userId}`);
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: 'Erro ao buscar cartões de crédito',
            };
        }
    },

    delete: async (id: number): Promise<ApiResponse<void>> => {
        try {
            const response = await api.delete(`/credit-cards/${id}`);
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: 'Erro ao deletar cartão de crédito',
            };
        }
    },
};

// Serviços de Método de Pagamento
export const paymentMethodService = {
    create: async (method: Omit<PaymentMethod, 'id'>): Promise<ApiResponse<PaymentMethod>> => {
        try {
            const response = await api.post('/payment-methods', method);
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: 'Erro ao criar método de pagamento',
            };
        }
    },

    getAll: async (userId: number): Promise<ApiResponse<PaymentMethod[]>> => {
        try {
            const response = await api.get(`/payment-methods?userId=${userId}`);
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: 'Erro ao buscar métodos de pagamento',
            };
        }
    },

    delete: async (id: number): Promise<ApiResponse<void>> => {
        try {
            const response = await api.delete(`/payment-methods/${id}`);
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: 'Erro ao deletar método de pagamento',
            };
        }
    },
}; 