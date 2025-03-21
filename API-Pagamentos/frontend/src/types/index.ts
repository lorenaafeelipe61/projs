// Tipos para o usuário
export interface User {
    id: number;
    name: string;
    email: string;
    cpf: string;
    phone: string;
}

// Tipos para cartão de crédito
export interface CreditCard {
    id: number;
    userId: number;
    number: string;
    holderName: string;
    expiryDate: string;
    cvv: string;
    isActive: boolean;
}

// Tipos para método de pagamento
export interface PaymentMethod {
    id: number;
    userId: number;
    type: 'CREDIT_CARD' | 'PIX' | 'BANK_SLIP';
    details: Record<string, string>;
    isActive: boolean;
}

// Tipos para credenciais de login
export interface LoginCredentials {
    email: string;
    password: string;
}

// Tipo genérico para respostas da API
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

// Tipos para o contexto de autenticação
export interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
}

// Tipos para configuração do Axios
export interface AxiosConfig {
    headers: {
        'Content-Type': string;
        Authorization?: string;
    };
} 